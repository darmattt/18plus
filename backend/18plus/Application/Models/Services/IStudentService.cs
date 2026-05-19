using Application.ViewModels.Converters;
using Application.ViewModels.LoginDtos;

namespace Application.Models.Services;

public interface IStudentService
{ 
    Task<StudentLoginResponse> RequestLoginCodeAsync(RequestStudentLoginCodeDto dto);
    Task<StudentLoginResponse> VerifyLoginCodeAsync(LoginStudentDto dto);
}
