using Application.ViewModels.Converters;
using Application.ViewModels.LoginDtos;

namespace Application.Models.Services;

public interface IStudentService
{ 
    Task<StudentResponse> LoginStudentAsync(LoginStudentDto dto);
}