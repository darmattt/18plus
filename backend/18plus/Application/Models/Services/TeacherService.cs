using Application.Infrastructure;
using Application.Models.Entities;
using Application.ViewModels.AddDtos;
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
    public async Task<TeacherLoginResponse> LoginTeacherAsync(LoginAdminDto dto)
    {
        logger.LogDebug("Teacher login attempt for email {Email}", dto.EmailAddress);

        var teacher = await db.Teachers
                          .Include(t => t.Email)
                          .FirstOrDefaultAsync(t => t.Email.Value.ToLower() == dto.EmailAddress.Value.ToLower())
                      ?? throw ServiceApplicationException.NotFound("Teacher not found");

        var validPassword = passwordService.Verify(teacher, dto.Password);

        if (!validPassword)
            throw ServiceApplicationException.Forbidden("Invalid password");

        var accessToken = tokenService.GenerateTeacherAccessToken(teacher);

        var refreshToken = tokenService.GenerateRefreshToken();

        var refreshTokenHash = tokenService.HashRefreshToken(refreshToken);

        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = teacher.Id,
            TokenHash = refreshTokenHash,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            IsRevoked = false
        });

        await db.SaveChangesAsync();

        logger.LogInformation("Teacher logged in successfully with id {Teacher}", teacher.Id);

        return new TeacherLoginResponse(
            accessToken,
            refreshToken,
            teacher.FirstName,
            teacher.LastName,
            teacher.Email
        );
    }

    public async Task<TeacherRefreshResponse> RefreshTeacherTokenAsync(string? refreshToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            throw ServiceApplicationException.Forbidden("Refresh token missing");

        var tokenHash = tokenService.HashRefreshToken(refreshToken);

        var storedToken = await db.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt =>
                rt.TokenHash == tokenHash &&
                !rt.IsRevoked &&
                rt.ExpiresAt > DateTime.UtcNow);

        if (storedToken is null)
            throw ServiceApplicationException.Forbidden("Invalid refresh token");

        var accessToken = tokenService.GenerateTeacherAccessToken(storedToken.User);

        return new TeacherRefreshResponse(accessToken);
    }
    

public async Task<TeacherResponse> CreateGroupAsync(CreateGroupDto dto)
    {
       var teacherGuid = currentUserService.UserId 
            ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var teacher = await db.Teachers
            .FirstOrDefaultAsync(t => t.PublicId == teacherGuid)
            ?? throw ServiceApplicationException.NotFound("Teacher not found");

        var groupExists = await db.Groups.AnyAsync(g => g.Name.Value == dto.ClassNumber.Value);
        if (groupExists)
            throw ServiceApplicationException.Forbidden($"Class Already Exists: {dto.ClassNumber}");

        var group = new Group(dto.ClassNumber, teacher);

        group.CreatedBy = await db.Teachers
            .Where(t => t.PublicId == teacherGuid )
            .Select(t => t.Id )
            .FirstOrDefaultAsync();

        await db.Groups.AddAsync(group);
        await db.SaveChangesAsync();

        var defaultWorksheets = await db.Worksheets
            .Where(w => DefaultModuleAccess.DefaultEnabledSlugs.Contains(w.Slug))
            .ToListAsync();

        foreach (var worksheet in defaultWorksheets)
        {
            var groupWorksheet = new GroupWorksheet(group, worksheet);
            groupWorksheet.Enable();
            db.GroupWorksheets.Add(groupWorksheet);
        }

        await db.SaveChangesAsync();

        return new TeacherResponse(
            teacher.Id,
            teacher.FirstName,
            teacher.LastName,
            group.Name
        );
    }


    public async Task<GroupResponse> PatchGroupAsync(int groupId, PatchGroupDto dto)
    {
        var teacherGuid = currentUserService.UserId 
            ?? throw ServiceApplicationException.Forbidden("User not authenticated");
        var group = await db.Groups.Include(group => group.Name)
                        .Include(group => group.Teacher)
                        .FirstOrDefaultAsync(g => g.Id == groupId)
            ??  throw ServiceApplicationException.NotFound("Class not found");
        if (group.Teacher.PublicId != teacherGuid)
            throw ServiceApplicationException.Forbidden("You cannot edit this class");
        if (dto.ClassNumber is not null)
            group.Name = dto.ClassNumber;
        group.UpdatedBy = await db.Teachers
            .Where(t => t.PublicId == teacherGuid )
            .Select(teacher => teacher.Id )
            .FirstOrDefaultAsync();

        group.UpdatedAt =  DateTime.UtcNow;
        await db.SaveChangesAsync();
        return new GroupResponse(group.Id, group.Name);
    }
    
    
    public async Task<List<StudentResponse>> GetMyGroupsMembers()
    {
        var teacherGuid = currentUserService.UserId
            ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var students = await db.Students
            .AsNoTracking()
            .Where(s => s.Group != null && s.Group.Teacher.PublicId == teacherGuid)
            .Select(s => new StudentResponse(
                s.Id,
                s.FirstName,
                s.LastName,
                s.Group!.Name
            ))
            .ToListAsync();

        return students;
    }

    public async Task DeleteGroupAsync(int groupId)
    {
        var teacherGuid = currentUserService.UserId
                        ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var group = await db.Groups
            .Include(g => g.Teacher)
            .FirstOrDefaultAsync(g => g.Id == groupId) 
            ?? throw ServiceApplicationException.NotFound("Class not found");
        
        if (group.Teacher.PublicId != teacherGuid)
            throw ServiceApplicationException.Forbidden("You cannot delete this class");

        db.Groups.Remove(group);
        await db.SaveChangesAsync();
    }



    public async Task<TeacherResponse> PatchMyProfileAsync(PatchTeacherDto dto)
    {
        var teacherGuid = currentUserService.UserId
                        ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var teacher = await db.Teachers
                          .FirstOrDefaultAsync(t => t.PublicId == teacherGuid)
                      ?? throw ServiceApplicationException.NotFound("Teacher not found");

        if (dto.Email is not null)
        {
            var emailTaken = await db.Teachers
                .AnyAsync(t => t.Email == dto.Email && t.PublicId != teacherGuid);

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
        teacher.UpdatedBy = await db.Teachers
            .Where(t => t.PublicId == teacherGuid )
            .Select(t => t.Id )
            .FirstOrDefaultAsync();


        await db.SaveChangesAsync();

        return new TeacherResponse(
            teacher.Id,
            teacher.FirstName,
            teacher.LastName,
            null
        );
    }

    public async Task<StudentResponse> AddStudentToGroupAsync(int groupId, AddStudentToMyGroupDto dto)
    {
        var teacherGuid = currentUserService.UserId
                          ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var group = await db.Groups
                        .Include(g => g.Teacher).Include(group => group.Name)
                        .FirstOrDefaultAsync(g =>
                            g.Id == groupId &&
                            g.Teacher.PublicId == teacherGuid)
                    ?? throw ServiceApplicationException.NotFound("Group not found");

        var student = await db.Students
                          .Include(s => s.Group)
                          .FirstOrDefaultAsync(s => s.Email.Value.ToLower() == dto.EMailAddress.Value)
                      ?? throw ServiceApplicationException.NotFound("Student doesn't exist");

        if (student.Group != null)
            throw ServiceApplicationException.Conflict("Student is already assigned to a group");

        student.Group = group;
        student.UpdatedAt = DateTime.UtcNow;
        student.UpdatedBy = await db.Teachers
            .Where(t => t.PublicId == teacherGuid)
            .Select(t => t.Id)
            .FirstOrDefaultAsync();

        await db.SaveChangesAsync();

        return new StudentResponse(
            student.Id,
            student.FirstName,
            student.LastName,
            group.Name
        );
    }
    
    public async Task RemoveStudentFromGroupAsync(int studentId)
    {
        var teacherGuid = currentUserService.UserId
                        ?? throw ServiceApplicationException.Forbidden("User not authenticated");
        
        var student = await db.Students.Include(s => s.Group)
                          .ThenInclude(g => g.Teacher)
                          .FirstOrDefaultAsync(s => s.Id == studentId)
                      ?? throw ServiceApplicationException.NotFound("Student not found");
        if (student.Group is null)
            throw ServiceApplicationException.Conflict("Student is not assigned to a group");
        if (student.Group.Teacher.PublicId != teacherGuid)
            throw ServiceApplicationException.Forbidden("You cannot remove students from another class");
        student.Group = null;
        
        student.UpdatedAt = DateTime.UtcNow;
        student.UpdatedBy = await db.Teachers
            .Where(t => t.PublicId == teacherGuid )
            .Select(teacher => teacher.Id )
            .FirstOrDefaultAsync();
        
        await db.SaveChangesAsync();
    }

    public async Task<List<ResultResponse>> GetStudentResultsAsync()
    {
        var teacherGuid = currentUserService.UserId
                        ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var results = await db.Results
            .AsNoTracking()
            .Where(r => r.Student.Group != null && r.Student.Group.Teacher.PublicId == teacherGuid)
            .Where(r => r.Worksheet.Slug.StartsWith("ws-"))
            .Select(r => new ResultResponse(
                r.Student.FirstName,
                r.Student.LastName,
                r.Student.Group!.Name,
                r.Worksheet.Name,
                r.SubmittedAt,
                r.Status
            ))
            .ToListAsync();

        return results;
    }
    
    public async Task<List<GroupWithStudentsResponse>> GetMyGroupsAsync()
    {
        var teacherGuid = currentUserService.UserId
                          ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var groups = await db.Groups
            .AsNoTracking()
            .Where(g =>  g.Teacher.PublicId == teacherGuid)
            .Select(g => new GroupWithStudentsResponse(
                g.Id,
                g.Name,
                g.JoinCode,
                db.Students
                    .OrderBy(s => s.FirstName)
                    .ThenBy(s => s.LastName)
                    .Where(s => s.Group != null && s.Group.Id == g.Id)
                    .Select(s =>  new StudentItemResponse(
                        s.Id,
                        s.FirstName,
                        s.LastName,
                        s.Email
                        )).ToList()
            ))
            .ToListAsync();
        return groups;
    }

    public async Task<List<string>> GetGroupEnabledWorksheetsAsync(int groupId)
    {
        var teacherGuid = currentUserService.UserId
                          ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var group = await db.Groups
                        .Include(g => g.Teacher)
                        .FirstOrDefaultAsync(g => g.Id == groupId)
                    ?? throw ServiceApplicationException.NotFound("Group not found");

        if (group.Teacher.PublicId != teacherGuid)
            throw ServiceApplicationException.Forbidden("You cannot view this class");

        return await db.GroupWorksheets
            .Where(gw => gw.Group.Id == groupId && gw.IsEnabled)
            .Select(gw => gw.Worksheet.Slug)
            .ToListAsync();
    }

    public async Task<List<string>> SetGroupWorksheetsAsync(int groupId, SetGroupWorksheetsDto dto)
    {
        var teacherGuid = currentUserService.UserId
                          ?? throw ServiceApplicationException.Forbidden("User not authenticated");

        var group = await db.Groups
                        .Include(g => g.Teacher)
                        .FirstOrDefaultAsync(g => g.Id == groupId)
                    ?? throw ServiceApplicationException.NotFound("Group not found");

        if (group.Teacher.PublicId != teacherGuid)
            throw ServiceApplicationException.Forbidden("You cannot edit this class");

        foreach (var slug in dto.Slugs)
        {
            var worksheet = await db.Worksheets.FirstOrDefaultAsync(w => w.Slug == slug);
            if (worksheet is null)
                continue;

            var groupWorksheet = await db.GroupWorksheets
                .FirstOrDefaultAsync(gw => gw.Group.Id == groupId && gw.Worksheet.Id == worksheet.Id);

            if (groupWorksheet is null)
            {
                groupWorksheet = new GroupWorksheet(group, worksheet);
                db.GroupWorksheets.Add(groupWorksheet);
            }

            if (dto.Enabled && !groupWorksheet.IsEnabled)
                groupWorksheet.Enable();
            else if (!dto.Enabled && groupWorksheet.IsEnabled)
                groupWorksheet.Disable();
        }

        await db.SaveChangesAsync();

        return await db.GroupWorksheets
            .Where(gw => gw.Group.Id == groupId && gw.IsEnabled)
            .Select(gw => gw.Worksheet.Slug)
            .ToListAsync();
    }
}
