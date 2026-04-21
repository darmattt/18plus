using Application.Infrastructure;
using Application.Models.Enitities;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.LoginDtos;
using Application.ViewModels.PatchDtos;
using Microsoft.EntityFrameworkCore;
using SpengerbiteApi.Exceptions;

namespace Application.Models.Services;

public class TeacherService(
    EighteenplusDbContext db,
    IPasswordService passwordService,
    ILogger<AdminService> logger,
    ITokenService tokenService,
    ICurrentUserService currentUserService
) : ITeacherService
{
    public async Task<TeacherLoginResponse> LoginTeacher(LoginAdminDto dto)
    {
        logger.LogDebug("Teacher login attempt for email {Email}", dto.EmailAddress);
        var teacher = await db.Teachers
                          .Include(userBase => userBase.Email)
                          .FirstOrDefaultAsync(a => a.Email.Value ==  dto.EmailAddress.Value)
                    ?? throw ServiceApplicationException.NotFound("Admin not found");

        var validPassword = passwordService.Verify(teacher, dto.Password);
        if (!validPassword)
            throw ServiceApplicationException.Forbidden("Invalid password");
        
        var token = tokenService.GenerateToken(teacher);
        
        logger.LogInformation("Teacher logged in successfully with id {Teacher}", teacher.Id);
        
        return new TeacherLoginResponse(token,teacher.FirstName, teacher.LastName, teacher.Email);
    }

    public async Task<TeacherResponse> CreateGroupAsync(CreateGroupDto dto)
    {
        var teacherId = currentUserService.UserId
                        ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var teacher = await db.Teachers
                          .FirstOrDefaultAsync(t => t.Id == teacherId)
                      ?? throw ServiceApplicationException.NotFound("Teacher not found");

        var groupExists = await db.Groups.AnyAsync(g => g.Name == dto.ClassNumber);
        if (groupExists)
            throw ServiceApplicationException.Forbidden($"Class Already Exists: {dto.ClassNumber}");

        var group = new Group(dto.ClassNumber, teacher);

        group.CreatedBy = teacherId;

        await db.Groups.AddAsync(group);
        await db.SaveChangesAsync();

        return new TeacherResponse(
            teacher.Id,
            teacher.FirstName,
            teacher.LastName,
            group.Name
        );
    }


    public async Task<GroupResponse> PatchGroupAsync( PatchGroupDto dto)
    {
        var teacherId = currentUserService.UserId 
            ?? throw ServiceApplicationException.Forbidden("User not authenticated");
        var group = await db.Groups.Include(group => group.Name)
                        .Include(group => group.Teacher)
                        .FirstOrDefaultAsync(g => g.Name == dto.ClassNumber)
            ??  throw ServiceApplicationException.NotFound("Class not found");
        if (group.Teacher.Id != teacherId)
            throw ServiceApplicationException.Forbidden("You cannot edit this class");
        if (dto.ClassNumber != null)
            group.Name = dto.ClassNumber;
        group.UpdatedBy = teacherId;
        group.UpdatedAt =  DateTime.UtcNow;
        await db.SaveChangesAsync();
        return new GroupResponse(group.Id, group.Name);
    }
    
    
    public async Task<List<StudentResponse>> GetMyGroupsMembers()
    {
        var teacherId = currentUserService.UserId
                        ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var students = await db.Students
            .AsNoTracking()
            .Where(s => s.Group != null && s.Group.Teacher.Id == teacherId)
            .Select(s => new StudentResponse(
                s.Id,
                s.FirstName,
                s.LastName,
                s.Group!.Name
            ))
            .ToListAsync();

        return students;
    }

    public async Task DeleteGroup(PatchGroupDto groupName)
    {
        var teacherId = currentUserService.UserId
                        ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var group = await db.Groups
            .Include(g => g.Teacher)
            .FirstOrDefaultAsync(g => g.Name == groupName.ClassNumber) 
            ?? throw ServiceApplicationException.NotFound("Class not found");
        
        if (group.Teacher.Id != teacherId)
            throw ServiceApplicationException.Forbidden("You cannot delete this class");

        db.Groups.Remove(group);
        await db.SaveChangesAsync();
    }
    

    public async Task<TeacherResponse> PatchMyProfileAsync(PatchTeacherDto dto)
    {
        var teacherId = currentUserService.UserId
                        ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var teacher = await db.Teachers
                          .FirstOrDefaultAsync(t => t.Id == teacherId)
                      ?? throw ServiceApplicationException.NotFound("Teacher not found");

        if (dto.Email is not null)
        {
            var emailTaken = await db.Teachers
                .AnyAsync(t => t.Email == dto.Email && t.Id != teacherId);

            if (emailTaken)
                throw ServiceApplicationException.Conflict(
                    $"A teacher with this email already exists: {dto.Email}");
        
            teacher.Email = dto.Email;
        }

        if (dto.FirstName is not null)
            teacher.FirstName = dto.FirstName;

        if (dto.LastName is not null)
            teacher.LastName = dto.LastName;

        if (dto.PhoneNumber is not null)
            
            teacher.PhoneNumber = dto.PhoneNumber;

        if (dto.Password is not null)
        {
            if (dto.OldPassword is null)
                throw ServiceApplicationException.Forbidden("Old password is required");

            var valid = passwordService.Verify(teacher, dto.OldPassword);
                if (!valid)
                    throw ServiceApplicationException.Forbidden("Old Password is incorrect");

            teacher.PasswordHash = passwordService.Hash(dto.Password);
        }

        teacher.UpdatedAt = DateTime.UtcNow;
        teacher.UpdatedBy = teacherId;

        await db.SaveChangesAsync();

        return new TeacherResponse(
            teacher.Id,
            teacher.FirstName,
            teacher.LastName,
            null
        );
    }

    public async Task<StudentResponse> AddStudentToGroup(int studentId)
    {
        var teacherId = currentUserService.UserId
            ?? throw ServiceApplicationException.Forbidden("User not authenticated");
        
        var group = await db.Groups
                        .Include(g => g.Teacher).Include(group => group.Name)
                        .FirstOrDefaultAsync(g => g.Teacher.Id == teacherId)
            ?? throw ServiceApplicationException.NotFound("Teacher not found");
        
        var student = await db.Students.Include(s => s.Group)
            .FirstOrDefaultAsync(s => s.Id == studentId)
            ?? throw ServiceApplicationException.NotFound("Student not found");
        if (student.Group != null)
            throw ServiceApplicationException.Conflict("Student is already assigned to a group");

        student.Group = group;
        
        student.UpdatedAt = DateTime.UtcNow;
        student.UpdatedBy = teacherId;
        
        await db.SaveChangesAsync();

        return new StudentResponse(
            student.Id,
            student.FirstName,
            student.LastName,
            group.Name);
    }

    public async Task RemoveStudentFromGroup(int studentId)
    {
        var teacherId = currentUserService.UserId
                        ?? throw ServiceApplicationException.Forbidden("User not authenticated");
        
        var group = await db.Groups
                        .Include(g => g.Teacher).Include(group => group.Name)
                        .FirstOrDefaultAsync(g => g.Teacher.Id == teacherId)
                    ?? throw ServiceApplicationException.NotFound("Teacher not found");
        
        var student = await db.Students.Include(s => s.Group)
                          .FirstOrDefaultAsync(s => s.Id == studentId)
                      ?? throw ServiceApplicationException.NotFound("Student not found");
        if (student.Group is null)
            throw ServiceApplicationException.Conflict("Student is already assigned to a group");

        student.Group = null;
        
        student.UpdatedAt = DateTime.UtcNow;
        student.UpdatedBy = teacherId;
        
        await db.SaveChangesAsync();
        
    }

    public async Task<List<ResultResponse>> GetStudentResults()
    {
        var teacherId = currentUserService.UserId
                        ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var results = await db.Results
            .AsNoTracking()
            .Where(r => r.Student.Group != null && r.Student.Group.Teacher.Id == teacherId)
            .Select(r => new ResultResponse(
                r.Student.FirstName,
                r.Student.LastName,
                r.Status
                
            ))
            .ToListAsync();

        return results;
    }
}