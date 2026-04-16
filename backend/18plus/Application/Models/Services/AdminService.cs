using Application.Infrastructure;
using Application.Models.Users;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.PatchDtos;
using Microsoft.EntityFrameworkCore;
using SpengerbiteApi.Exceptions;

namespace Application.Models.Services;

public class Admincontroller(
    EighteenplusDbContext db,
    IPasswordHasherService passwordHasherService,
    ILogger<Admincontroller> logger
) : IAdminService
{
    // READ: project directly to DTO
    public async Task<List<TeacherResponse>> GetAllTeachersAsync()
    {
        logger.LogDebug("Fetching all teachers");

        var teachersResponse = await db.Teachers
            .AsNoTracking()
            .OrderBy(t => t.LastName)
            .ThenBy(t => t.FirstName)
            .Select(t => new TeacherResponse(
                t.Id,
                t.FirstName,
                t.LastName,
                t.Email,
                t.Role,
                t.PhoneNumber
            ))
            .ToListAsync();

        logger.LogInformation("Fetched {Count} teachers", teachersResponse.Count);
        return teachersResponse;
    }

    // READ: project directly to DTO
    public async Task<TeacherResponse> GetOneTeacherAsync(int id)
    {
        logger.LogDebug("Fetching teacher with id {TeacherId}", id);

        var teacherResponse = await db.Teachers
            .AsNoTracking()
            .Where(t => t.Id == id)
            .Select(t => new TeacherResponse(
                t.Id,
                t.FirstName,
                t.LastName,
                t.Email,
                t.Role,
                t.PhoneNumber
            ))
            .FirstOrDefaultAsync()
            ?? throw ApplicationServiceException.NotFound($"Teacher not found: {id}");

        logger.LogInformation("Fetched teacher with id {TeacherId}", id);
        return teacherResponse;
    }

    // WRITE: load entity, validate, save, map entity -> DTO
    public async Task<TeacherResponse> CreateTeacherAsync(CreateTeacherDto request)
    {
        logger.LogDebug("Creating new teacher with email {Email}", request.Email);
        
        var teacher = new Teacher(
            request.FirstName,
            request.LastName,
            request.Email,
            passwordHasherService.Hash(request.Password),
            request.PhoneNumber
        );

        db.Teachers.Add(teacher);
        await db.SaveChangesAsync();

        var teacherResponse = new TeacherResponse(
            teacher.Id,
            teacher.FirstName,
            teacher.LastName,
            teacher.Email,
            teacher.Role,
            teacher.PhoneNumber
        );

        logger.LogInformation("Created new teacher with id {TeacherId}", teacher.Id);
        return teacherResponse;
    }

    public async Task<TeacherResponse> UpdateTeacherAsync(CreateTeacherDto request, int id)
    {
        logger.LogDebug("Updating teacher with id {TeacherId}", id);

        var teacher = await db.Teachers
            .FirstOrDefaultAsync(t => t.Id == id)
            ?? throw ApplicationServiceException.NotFound($"Teacher not found: {id}");

        var emailTaken = await db.Teachers
            .AnyAsync(t => t.Email == request.Email && t.Id != id);

        if (emailTaken)
            throw ApplicationServiceException.Conflict($"A teacher with this email already exists: {request.Email}");

        teacher.UpdatedAt = DateTime.UtcNow;
        teacher.FirstName = request.FirstName;
        teacher.LastName = request.LastName;
        teacher.Email = request.Email;
        teacher.PasswordHash = passwordHasherService.Hash(request.Password);
        teacher.PhoneNumber = request.PhoneNumber;

        await db.SaveChangesAsync();

        var teacherResponse = new TeacherResponse(
            teacher.Id,
            teacher.FirstName,
            teacher.LastName,
            teacher.Email,
            teacher.Role,
            teacher.PhoneNumber
        );

        logger.LogInformation("Updated teacher with id {TeacherId}", id);
        return teacherResponse;
    }

    // WRITE: load entity, patch, save, map entity -> DTO
    public async Task<TeacherResponse> PatchTeacherAsync(PatchTeacherDto request, int id)
    {
        logger.LogDebug("Patching teacher with id {TeacherId}", id);

        var teacher = await db.Teachers
            .FirstOrDefaultAsync(t => t.Id == id)
            ?? throw ApplicationServiceException.NotFound($"Teacher not found: {id}");

        if (request.Email is not null)
        {
            var emailTaken = await db.Teachers
                .AnyAsync(t => t.Email == request.Email && t.Id != id);

            if (emailTaken)
                throw ApplicationServiceException.Conflict($"A teacher with this email already exists: {request.Email}");

            teacher.Email = request.Email;
        }

        if (request.FirstName is not null)
            teacher.FirstName = request.FirstName;

        if (request.LastName is not null)
            teacher.LastName = request.LastName;

        if (request.PhoneNumber is not null)
            teacher.PhoneNumber = request.PhoneNumber;

        if (request.Password is not null)
            teacher.PasswordHash = passwordHasherService.Hash(request.Password);

        teacher.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        var teacherResponse = new TeacherResponse(
            teacher.Id,
            teacher.FirstName,
            teacher.LastName,
            teacher.Email,
            teacher.Role,
            teacher.PhoneNumber
        );

        logger.LogInformation("Patched teacher with id {TeacherId}", id);
        return teacherResponse;
    }

    // DELETE: usually return void/Task
    public async Task DeleteTeacherAsync(int teacherId)
    {
        
        logger.LogDebug("Deleting teacher with id {TeacherId}", teacherId);

        var teacher = await db.Teachers
            .FindAsync(teacherId)
            ?? throw ApplicationServiceException.NotFound($"Teacher not found: {teacherId}");

        db.Teachers.Remove(teacher);
        await db.SaveChangesAsync();

        logger.LogInformation("Deleted teacher with id {TeacherId}", teacherId);
    }
}