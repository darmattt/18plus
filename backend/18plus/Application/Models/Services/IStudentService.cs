using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.LoginDtos;

namespace Application.Models.Services;

public interface IStudentService
{
    Task<RegisterStudentResponse> RegisterAsync(RegisterStudentDto dto);
    Task<StudentLoginResponse> RequestLoginCodeAsync(RequestStudentLoginCodeDto dto);
    Task<StudentLoginResponse> VerifyLoginCodeAsync(LoginStudentDto dto);
    Task<StudentProfileResponse> GetCurrentStudentProfileAsync();
    Task<List<string>> GetMyEnabledWorksheetsAsync();
    Task<List<StudentResultSummaryResponse>> GetMyResultsAsync();
    Task<StudentResultResponse> GetMyResultAsync(string slug);
    Task<StudentResultResponse> SaveMyResultAsync(string slug, SaveResultDto dto);
}
