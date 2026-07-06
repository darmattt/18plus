using Application.Infrastructure;
using Application.Models.Entities;
using Application.Models.Users;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.LoginDtos;
using Microsoft.EntityFrameworkCore;
using SpengerbiteApi.Exceptions;

namespace Application.Models.Services;

public class StudentService(
    EighteenplusDbContext db,
    IOneTimeCodeService oneTimeCodeService,
    ITokenService tokenService,
    ICurrentUserService currentUserService,
    ILogger<StudentService> logger,
    IEmailSender emailSender
) : IStudentService
{
    public async Task<RegisterStudentResponse> RegisterAsync(RegisterStudentDto dto)
    {
        var group = await db.Groups.FirstOrDefaultAsync(g => g.JoinCode == dto.JoinCode)
                    ?? throw ServiceApplicationException.NotFound("Ungültiger Gruppencode");

        var emailTaken = await db.Students.AnyAsync(s => s.Email.Value == dto.Email.Value);
        if (emailTaken)
            throw ServiceApplicationException.Conflict("Es existiert bereits ein Konto mit dieser E-Mail-Adresse.");

        var student = new Student(dto.FirstName, dto.LastName, dto.Email)
        {
            Group = group
        };

        db.Students.Add(student);
        await db.SaveChangesAsync();

        logger.LogInformation("Student self-registered with id {StudentId} into group {GroupId}", student.Id, group.Id);

        return new RegisterStudentResponse("Registrierung erfolgreich");
    }

    public async Task<StudentLoginResponse> RequestLoginCodeAsync(RequestStudentLoginCodeDto dto)
    {
        var student = await db.Students.FirstOrDefaultAsync(s => s.Email.Value == dto.EmailAddress.Value)
                      ?? throw ServiceApplicationException.NotFound("Account doesn't exist pls sign in or try other account");

        var result = oneTimeCodeService.Create(student, TimeSpan.FromMinutes(10));
        db.OneTimeCodes.Add(result.OneTimeCode);
        await db.SaveChangesAsync();
        await emailSender.SendEmailAsync(student.Email.Value, "One time code", $"Your one time code is:{result.PlainCode}");

        return new StudentLoginResponse(
            true,
            "One time code sent to your email",
            null,
            null
        );
    }

    public async Task<StudentLoginResponse> VerifyLoginCodeAsync(LoginStudentDto dto)
    {
        var student = await db.Students
                          .Include(s => s.Group)
                          .FirstOrDefaultAsync(s => s.Email.Value == dto.EmailAddress.Value)
                      ?? throw ServiceApplicationException.NotFound("Account doesn't exist pls sign in or try other account");

        if (string.IsNullOrWhiteSpace(dto.OneTimeCode))
            throw ServiceApplicationException.BadRequest("One time code is required");

        var oneTimeCode = await db.OneTimeCodes
                              .Where(otc => otc.Student.Id == student.Id)
                              .OrderByDescending(otc => otc.CreatedAt)
                              .FirstOrDefaultAsync()
                          ?? throw ServiceApplicationException.BadRequest("No one time code found");

        if (!oneTimeCodeService.Verify(oneTimeCode, dto.OneTimeCode))
            throw ServiceApplicationException.BadRequest("invalid one time code");

        var accessToken = tokenService.GenerateStudentAccessToken(student);

        logger.LogInformation("Student logged in successfully with id {StudentId}", student.Id);

        await db.SaveChangesAsync();

        return new StudentLoginResponse(
            false,
            null,
            new StudentResponse(student.Id, student.FirstName, student.LastName, student.Group?.Name),
            accessToken
        );
    }

    public async Task<StudentProfileResponse> GetCurrentStudentProfileAsync()
    {
        var studentGuid = currentUserService.UserId
                          ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var student = await db.Students
                          .Include(s => s.Group)
                          .ThenInclude(g => g.Teacher)
                          .FirstOrDefaultAsync(s => s.PublicId == studentGuid)
                      ?? throw ServiceApplicationException.NotFound("Student not found");

        var teacherName = student.Group?.Teacher is null
            ? null
            : $"{student.Group.Teacher.FirstName} {student.Group.Teacher.LastName}";

        return new StudentProfileResponse(
            student.FirstName,
            student.LastName,
            student.Email.Value,
            student.Group?.Name?.Value,
            teacherName
        );
    }

    public async Task<List<string>> GetMyEnabledWorksheetsAsync()
    {
        var studentGuid = currentUserService.UserId
                          ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var student = await db.Students
                          .Include(s => s.Group)
                          .FirstOrDefaultAsync(s => s.PublicId == studentGuid)
                      ?? throw ServiceApplicationException.NotFound("Student not found");

        if (student.Group is null)
            return new List<string>();

        return await db.GroupWorksheets
            .Where(gw => gw.Group.Id == student.Group.Id && gw.IsEnabled)
            .Select(gw => gw.Worksheet.Slug)
            .ToListAsync();
    }

    public async Task<List<StudentResultSummaryResponse>> GetMyResultsAsync()
    {
        var studentGuid = currentUserService.UserId
                          ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var results = await db.Results
            .AsNoTracking()
            .Where(r => r.Student.PublicId == studentGuid)
            .Select(r => new StudentResultSummaryResponse(
                r.Worksheet.Slug,
                r.Status
            ))
            .ToListAsync();

        return results;
    }

    public async Task<StudentResultResponse> GetMyResultAsync(string slug)
    {
        var studentGuid = currentUserService.UserId
                          ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var student = await db.Students
                          .Include(s => s.Group)
                          .FirstOrDefaultAsync(s => s.PublicId == studentGuid)
                      ?? throw ServiceApplicationException.NotFound("Student not found");

        var worksheet = await db.Worksheets
                            .FirstOrDefaultAsync(w => w.Slug == slug)
                        ?? throw ServiceApplicationException.NotFound("Worksheet not found");

        await EnsureWorksheetEnabledAsync(student, worksheet);

        var result = await db.Results
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Student.PublicId == studentGuid && r.Worksheet.Slug == slug);

        if (result is null)
            return new StudentResultResponse(null, null);

        return new StudentResultResponse(result.AnswersJson, result.Status);
    }

    public async Task<StudentResultResponse> SaveMyResultAsync(string slug, SaveResultDto dto)
    {
        var studentGuid = currentUserService.UserId
                          ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var student = await db.Students
                          .Include(s => s.Group)
                          .FirstOrDefaultAsync(s => s.PublicId == studentGuid)
                      ?? throw ServiceApplicationException.NotFound("Student not found");

        var worksheet = await db.Worksheets
                            .FirstOrDefaultAsync(w => w.Slug == slug)
                        ?? throw ServiceApplicationException.NotFound("Worksheet not found");

        await EnsureWorksheetEnabledAsync(student, worksheet);

        var result = await db.Results
            .FirstOrDefaultAsync(r => r.Student.PublicId == studentGuid && r.Worksheet.Slug == slug);

        if (result is null)
        {
            result = new Result(dto.AnswersJson, student, worksheet);
            db.Results.Add(result);
        }
        else
        {
            result.UpdateAnswers(dto.AnswersJson);
        }

        if (dto.Submit)
            result.Submit();

        await db.SaveChangesAsync();

        return new StudentResultResponse(result.AnswersJson, result.Status);
    }

    private async Task EnsureWorksheetEnabledAsync(Student student, Worksheet worksheet)
    {
        if (student.Group is null)
            throw ServiceApplicationException.Forbidden("Dieses Arbeitsblatt ist für deine Gruppe noch nicht freigeschaltet.");

        var isEnabled = await db.GroupWorksheets
            .AnyAsync(gw => gw.Group.Id == student.Group.Id && gw.Worksheet.Id == worksheet.Id && gw.IsEnabled);

        if (!isEnabled)
            throw ServiceApplicationException.Forbidden("Dieses Arbeitsblatt ist für deine Gruppe noch nicht freigeschaltet.");
    }
}
