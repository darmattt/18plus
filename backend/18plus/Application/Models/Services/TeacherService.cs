using Application.Infrastructure;
using Application.Models.Users;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.PatchDtos;
using Microsoft.EntityFrameworkCore;
//cancelation token
namespace Application.Models.Services;

public class TeacherService(
    EighteenplusDbContext db,
    IPasswordHasherService passwordHasherService,
    ILogger<TeacherService> logger) : ITeacherService
{
    public async Task<List<Teacher>> GetAllTeachersAsync()
    {
        logger.LogDebug("Fetching teachers");
        var teachers = await db.Teachers
            .AsNoTracking()
            .ToListAsync();
        logger.LogDebug("Teachers fetched");
        return teachers;
    }

    public async Task<Teacher> GetOneTeacherAsync(int id)
    {
        logger.LogDebug("Fetching teacher with id {TeacherId}", id);

        var foundTeacher = await db.Teachers
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (foundTeacher is null)
        {
            logger.LogWarning("Teacher with id {TeacherId} was not found", id);
            throw new KeyNotFoundException($"Teacher with id {id} not found");
        }

        logger.LogInformation("Fetched teacher with id {TeacherId}", id);
        return foundTeacher;
    }

    public async Task<Teacher> CreateTeacherAsync(CreateTeacherDto request)
    {
        logger.LogDebug("Creating new teacher with email {Email}", request.Email);

        var teacher = new Teacher(
            request.FirstName,
            request.LastName,
            request.Email,
            passwordHasherService.Hash(request.Password),
            request.PhoneNumber
        );

        await db.Teachers.AddAsync(teacher);
        await db.SaveChangesAsync();

        logger.LogInformation("Created new teacher with email {Email}", request.Email);

        return teacher;
    }

    public async Task<Teacher> DeleteTeacherAsync(int id)
    {
        logger.LogDebug("Deleting teacher with id {TeacherId}", id);
        var foundTeacher = await db.Teachers.FindAsync(id);

        if (foundTeacher is null)
        {
            logger.LogWarning("Teacher with id {TeacherId} was not found", id);
            throw new KeyNotFoundException($"Teacher with id {id} not found");
        }
        db.Teachers.Remove(foundTeacher);
        await db.SaveChangesAsync();

        logger.LogInformation("Deleted teacher with id {TeacherId}", id);
        return foundTeacher;
    }

    public async Task<Teacher> UpdateTeacherAsync(CreateTeacherDto request, int id)
    {
        logger.LogDebug("Updating teacher with id {TeacherId}", id);

        var foundTeacher = await db.Teachers.FindAsync(id);
        if (foundTeacher is null)
        {
            logger.LogWarning("Teacher with id {TeacherId} was not found", id);
            throw new KeyNotFoundException($"Teacher with id {id} not found");
        }

        foundTeacher.UpdatedAt = DateTime.UtcNow;
        foundTeacher.FirstName = request.FirstName;
        foundTeacher.LastName = request.LastName;
        foundTeacher.Email = request.Email;
        foundTeacher.PasswordHash = passwordHasherService.Hash(request.Password);
        foundTeacher.PhoneNumber = request.PhoneNumber;

        await db.SaveChangesAsync();

        logger.LogInformation("Updated teacher with id {TeacherId}", id);
        return foundTeacher;
    }

    public async Task<Teacher> PatchTeacherAsync(PatchTeacherDto request, int id)
    {
        logger.LogDebug("Patching teacher with id {TeacherId}", id);

        var foundTeacher = await db.Teachers.FindAsync(id);
        if (foundTeacher is null)
        {
            logger.LogWarning("Teacher with id {TeacherId} was not found", id);
            throw new KeyNotFoundException($"Teacher with id {id} not found");
        }

        if (request.FirstName is not null)
            foundTeacher.FirstName = request.FirstName;

        if (request.LastName is not null)
            foundTeacher.LastName = request.LastName;

        if (request.Email is not null)
            foundTeacher.Email = request.Email;

        if (request.PhoneNumber is not null)
            foundTeacher.PhoneNumber = request.PhoneNumber;
        
        if (request.Password is not null)
            foundTeacher.PasswordHash = passwordHasherService.Hash(request.Password);

        foundTeacher.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        logger.LogInformation("Patched teacher with id {TeacherId}", id);
        return foundTeacher;
    }
    
}