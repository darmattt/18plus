using Application.Infrastructure;
using Application.Models.Users;
using Application.ViewModels.Converters;
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
}
