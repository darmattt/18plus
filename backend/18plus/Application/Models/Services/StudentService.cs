using Application.Infrastructure;
using Application.Models.Users;
using Application.ViewModels.Converters;
using Application.ViewModels.LoginDtos;

namespace Application.Models.Services;

public class StudentService (
    EighteenplusDbContext db,
    IOneTimeCodeService oneTimeCodeService,
    ITokenService tokenService,
    ICurrentUserService currentUserService,
    ILogger<StudentService> logger
    ) : IStudentService 
{
    public async Task<StudentResponse> LoginStudentAsync(LoginStudentDto dto)
    {
        
    }
    
}