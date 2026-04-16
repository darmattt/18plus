using Application.Models.Users;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.PatchDtos;

namespace Application.Models.Services;

public interface ITeacherService
{
    public Task<List<TeacherResponse>> GetAllTeachersAsync();
    public Task<TeacherResponse?> GetOneTeacherAsync(int id);
    public Task<TeacherResponse?> CreateTeacherAsync(CreateTeacherDto teacher);
    public Task DeleteTeacherAsync(int id);
    public Task<TeacherResponse> PatchTeacherAsync(PatchTeacherDto teacher, int id);
    public Task<TeacherResponse> UpdateTeacherAsync(CreateTeacherDto teacher, int id);
    
    
}
