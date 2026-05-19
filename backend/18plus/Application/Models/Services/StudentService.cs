using System.Diagnostics.CodeAnalysis;
using Application.Infrastructure;
using Application.Models.Users;
using Application.ViewModels.Converters;
using Application.ViewModels.LoginDtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Console;
using SpengerbiteApi.Exceptions;

namespace Application.Models.Services;

public class StudentService (
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
            null);
    }
    

    public async Task<StudentLoginResponse> VerifyLoginCodeAsync(LoginStudentDto dto)
    {
        var student = await db.Students.FirstOrDefaultAsync(s => s.Email.Value == dto.EmailAddress.Value) 
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
        
        await db.SaveChangesAsync();
        
        return new StudentLoginResponse(
            false,
            null,
            new StudentResponse(student.Id, student.FirstName, student.LastName, student.Group?.Name));
    }
}
