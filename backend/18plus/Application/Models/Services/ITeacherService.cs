using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.LoginDtos;
using Application.ViewModels.PatchDtos;

namespace Application.Models.Services;

public interface ITeacherService
{
    Task<TeacherLoginResponse> LoginTeacher(LoginAdminDto dto);
    Task<TeacherResponse> CreateGroupAsync(CreateGroupDto dto);
    Task<List<GroupResponse>> PatchGroupAsync(int id, PatchGroupDto dto);
    Task<List<StudentResponse>> GetMyGroupsMembers(int id);
    Task<List<TeacherResponse>> PatchTeacherAsync(int id, PatchTeacherDto dto);
    Task DeleteGroupAsync();
    Task<StudentResponse> AddStudentToGroup(int id);
    Task RemoveStudentFromGroup(int id);
    Task<List<ResultResponse>> GetStudentResults();

}