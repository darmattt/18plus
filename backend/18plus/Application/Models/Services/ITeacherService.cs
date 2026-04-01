using Application.Models.Users;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.PatchDtos;

namespace Application.Models.Services;

public interface ITeacherService
{
    public Task<List<Teacher>> GetAllTeachersAsync();
    public Task<Teacher?> GetOneTeacherAsync(int id);
    public Task<Teacher?> CreateTeacherAsync(CreateTeacherDto teacher);
    public Task<Teacher> DeleteTeacherAsync(int id);
    
    public Task<Teacher> PatchTeacherAsync(PatchTeacherDto teacher, int id);
    public Task<Teacher> UpdateTeacherAsync(CreateTeacherDto teacher, int id);
    
    
}
