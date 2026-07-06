using Application.ViewModels.AddDtos;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.LoginDtos;
using Application.ViewModels.PatchDtos;

namespace Application.Models.Services;

public interface ITeacherService
{
    Task<TeacherLoginResponse> LoginTeacherAsync(LoginAdminDto dto);
    Task<TeacherRefreshResponse> RefreshTeacherTokenAsync(string? refreshToken);
    Task<TeacherResponse> CreateGroupAsync(CreateGroupDto dto);
    Task<GroupResponse> PatchGroupAsync(int groupId, PatchGroupDto dto);
    Task<List<StudentResponse>> GetMyGroupsMembers();
    Task DeleteGroupAsync(int groupId);
    Task<TeacherResponse> PatchMyProfileAsync(PatchTeacherDto dto);
    Task<StudentResponse> AddStudentToGroupAsync(int groupId, AddStudentToMyGroupDto dto);
    Task RemoveStudentFromGroupAsync(int studentId);
    Task<List<ResultResponse>> GetStudentResultsAsync();
    Task<List<GroupWithStudentsResponse>> GetMyGroupsAsync();
    Task<List<string>> GetGroupEnabledWorksheetsAsync(int groupId);
    Task<List<string>> SetGroupWorksheetsAsync(int groupId, SetGroupWorksheetsDto dto);
}