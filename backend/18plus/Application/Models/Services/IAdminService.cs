using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.LoginDtos;
using Application.ViewModels.PatchDtos;

namespace Application.Models.Services;

public interface IAdminService
{
    Task<AdminResponse> CreateAdminAsync(CreateAdminDto adminDto);
    Task<AdminResponse> AdminLoginAsync(LoginAdminDto adminDto);
    Task<List<TeacherResponse>> GetAllTeachersAsync();
    Task<List<TeacherResponse>> GetTeacherByIdAsync(int id);
    Task<List<TeacherResponse>> SearchTeachersByNameAsync(string lastName);
    Task<TeacherResponse> CreateTeacherAsync(CreateTeacherDto teacherDto);
    Task DeleteTeacherAsync(int id); 
    Task<TeacherResponse> PatchTeacherAsync(PatchTeacherDto teacherDto, int id);

    Task<TeacherResponse> CreateGroupAsync(int id, CreateGroupDto groupDto);
    Task <List<TeacherResponse>> GetGroupByNameAsync(string groupName);
    Task DeleteGroupAsync(int id);
//     Task<List<StudentResponse>> GetAllStudentsAsync();
//     Task<StudentResponse> GetOneStudentAsync(int id);
//     Task<StudentResponse?> CreateStudentAsync(CreateStudentDto request);
//     Task DeleteStudentAsync(int id);
//     Task<StudentResponse> UpdateStudentAsync(CreateStudentDto request, int id);
//     Task<StudentResponse> PatchStudentAsync(PatchStudentDto request, int id);
}