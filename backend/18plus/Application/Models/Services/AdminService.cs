using Application.Infrastructure;
using Application.Models.Entities;
using Application.Models.Users;
using Application.Models.ValueObjects;
using Application.ViewModels.Converters;
using Application.ViewModels.CreateDtos;
using Application.ViewModels.LoginDtos;
using Application.ViewModels.PatchDtos;
using Microsoft.EntityFrameworkCore;
using SpengerbiteApi.Exceptions;

namespace Application.Models.Services;

public class AdminService(
    EighteenplusDbContext db,
    IPasswordService passwordService,
    ILogger<AdminService> logger
) : IAdminService
{
    //✅ Creates an Admin
    public async Task<AdminResponse> CreateAdminAsync(CreateAdminDto adminDto)  
    {
        logger.LogDebug("Creating new teacher with email {Email}", adminDto.Email);

        var admin = new Admin(
            adminDto.FirstName,
            adminDto.LastName,
            adminDto.Email,
            passwordService.Hash(adminDto.Password)
        );

        db.Admins.Add(admin);
        await db.SaveChangesAsync();

        var adminResponse = new AdminResponse(
            admin.FirstName,
            admin.LastName,
            admin.Role
        );

        logger.LogInformation("Created new teacher with id {TeacherId}", admin.Id);
        return adminResponse;
    }

    public async Task<AdminResponse> AdminLoginAsync(LoginAdminDto adminDto)
    {
        logger.LogDebug("Admin login attempt for email {Email}", adminDto.EmailAddress);
        var admin = await db.Admins
            .FirstOrDefaultAsync(a => a.Email.Value.ToLower() == adminDto.EmailAddress.Value)
            ?? throw ServiceApplicationException.NotFound("Admin not found");

        var validPassword = passwordService.Verify(admin, adminDto.Password);
        if (!validPassword)
            throw ServiceApplicationException.Forbidden("Invalid password");
        
        logger.LogInformation("Admin logged in successfully with id {AdminId}", admin.Id);
        
        return new AdminResponse(admin.FirstName, admin.LastName, admin.Role);
    }

    //✅ Creates a Teacher 
    public async Task<TeacherResponse> CreateTeacherAsync(CreateTeacherDto teacherDto)
    {
        logger.LogDebug("Creating new teacher with email {Email}", teacherDto.Email);


        var teacher = new Teacher(
            teacherDto.FirstName,
            teacherDto.LastName,
            teacherDto.Email,
            passwordService.Hash(teacherDto.Password),
            teacherDto.PhoneNumber
        );

        db.Teachers.Add(teacher);
        await db.SaveChangesAsync();

        var teacherResponse = new TeacherResponse(
            teacher.Id,
            teacher.FirstName,
            teacher.LastName,
            null
        );

        logger.LogInformation("Created new teacher with id {TeacherId}", teacher.Id);
        return teacherResponse;
    }


    //✅ Gets all teacher 
    public async Task<List<TeacherResponse>> GetAllTeachersAsync()
    {
        logger.LogDebug("Fetching all teachers");

        var teacherResponse = await db.Teachers
            .AsNoTracking()
            .Select(t => new TeacherResponse(
                t.Id,
                t.FirstName,
                t.LastName,
                db.Groups
                    .Where(g => g.Teacher.Id == t.Id)
                    .Select(g => g.Name)
                    .FirstOrDefault()
            ))
            .ToListAsync();

        logger.LogInformation("Fetched all teachers");
        return teacherResponse;
    }

    //✅ Gets a teacher with their groups by ID
    public async Task<List<TeacherResponse>> GetTeacherByIdAsync(int id)
    {
        logger.LogDebug("Fetching teacher with the firstname {TeacherId}", id);

        var teacherResponse = await db.Teachers
            .AsNoTracking()
            .Where(t => t.Id == id)
            .Select(t => new TeacherResponse(
                t.Id,
                t.FirstName,
                t.LastName,
                db.Groups
                    .Where(g => g.Teacher.Id == t.Id)
                    .Select(g => g.Name)
                    .FirstOrDefault() ?? new ClassNumber("0Klasse")
            ))
            .ToListAsync();

        logger.LogInformation("Fetched teacher with the firstname {TeacherId}", id);
        return teacherResponse;
    }


//✅ Gets a teacher with their groups by name
    public async Task<List<TeacherResponse>> SearchTeachersByNameAsync(string lastName)
    {
        logger.LogDebug("Fetching teacher with the firstname {TeacherFirstName}", lastName);

        var teacherResponse = await db.Teachers
            .AsNoTracking()
            .Where(t => t.LastName.StartsWith(lastName))
            .Select(t => new TeacherResponse(
                t.Id,
                t.FirstName,
                t.LastName,
                db.Groups
                    .Where(g => g.Teacher.Id == t.Id)
                    .Select(g => g.Name)
                    .FirstOrDefault()
            ))
            .ToListAsync();

        logger.LogInformation("Fetched teacher with the firstname {TeacherFirstName}", lastName);
        return teacherResponse;
    }


    //✅ Removes a teacher from the db
    public async Task DeleteTeacherAsync(int id)
    {
        logger.LogDebug("Deleting teacher with id {TeacherId}", id);

        var teacher = await db.Teachers
                          .FirstOrDefaultAsync(t => t.Id == id)
                      ?? throw ServiceApplicationException.NotFound($"Teacher not found: {id}");

        db.Teachers.Remove(teacher);
        await db.SaveChangesAsync();

        logger.LogInformation("Deleted teacher with id {TeacherId}", id);
    }

    //Remove a student from the db
    public async Task DeleteStudentAsync(int id)
    {
        logger.LogDebug("Deleting student with id {StudentId}", id);

        var student = await db.Students
                          .FirstOrDefaultAsync(s => s.Id == id)
                      ?? throw ServiceApplicationException.NotFound($"Stusent not found: {id}");

        db.Students.Remove(student);
        await db.SaveChangesAsync();

        logger.LogInformation("Deleted student with id {StudentId}", id);
    }

    //✅change something from the teacher
    public async Task<TeacherResponse> PatchTeacherAsync(PatchTeacherDto teacherDto, int id)
    {
        logger.LogDebug("Patching teacher with id {TeacherId}", id);

        var group = await db.Groups.Include(group => group.Name).FirstOrDefaultAsync(g => g.Teacher.Id == id);

        var teacher = await db.Teachers
                          .FirstOrDefaultAsync(t => t.Id == id)
                      ?? throw ServiceApplicationException.NotFound($"Teacher not found: {id}");

        if (teacherDto.Email is not null)
        {
            var emailTaken = await db.Teachers
                .AnyAsync(t => t.Email == teacherDto.Email && t.Id != id);

            if (emailTaken)
                throw ServiceApplicationException.Conflict(
                    $"A teacher with this email already exists: {teacherDto.Email}");

            teacher.Email = teacherDto.Email;
        }

        if (teacherDto.FirstName is not null)
            teacher.FirstName = teacherDto.FirstName;

        if (teacherDto.LastName is not null)
            teacher.LastName = teacherDto.LastName;

        if (teacherDto.PhoneNumber is not null)
            teacher.PhoneNumber = teacherDto.PhoneNumber;

        if (teacherDto.Password is not null)
            teacher.PasswordHash = passwordService.Hash(teacherDto.Password);

        if (teacherDto.ClassNumber is not null)
        {
            if (group is null)
            {
                group = new Group(teacherDto.ClassNumber, teacher);
                await db.Groups.AddAsync(group);
            }

            group.Name = teacherDto.ClassNumber;
        }


        teacher.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        var teacherResponse = new TeacherResponse(
            teacher.Id,
            teacher.FirstName,
            teacher.LastName,
            group?.Name ?? new ClassNumber("0Klasse"));

        logger.LogInformation("Patched teacher with id {TeacherId}", id);
        return teacherResponse;
    }

    //Change something from the student
    public async Task<StudentResponse> PatchStudentAsync(PatchStudentDto studentDto, int id)
    {
        logger.LogDebug("Patching student with id {StudentId}", id);

        var group = await db.Groups.Include(group => group.Name)
            .FirstOrDefaultAsync(g => g.Teacher.Id == id);
        var student = await db.Students.FirstOrDefaultAsync(s => s.Id == id)
                      ?? throw ServiceApplicationException.NotFound($"Student not found: {id}");

        if (studentDto.Email is not null)
        {
            var emailTaken = await db.Teachers
                .AnyAsync(t => t.Email == studentDto.Email && t.Id != id);

            if (emailTaken)
                throw ServiceApplicationException.Conflict(
                    $"A teacher with this email already exists: {studentDto.Email}");

            student.Email = studentDto.Email;
        }

        if (studentDto.FirstName is not null)
            student.FirstName = studentDto.FirstName;

        if (studentDto.LastName is not null)
            student.LastName = studentDto.LastName;

        if (studentDto.Group?.Name is not null)
            student.Group = new Group(studentDto.Group.Name, studentDto.Group.Teacher);


        student.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        var studentResponse = new StudentResponse(
            student.Id,
            student.FirstName,
            student.LastName,
            group?.Name);

        logger.LogInformation("Patched teacher with id {TeacherId}", id);
        return studentResponse;
    }

    public async Task<TeacherResponse> CreateGroupAsync(int id, CreateGroupDto groupDto)
    {
        var teacher = await db.Teachers.FirstOrDefaultAsync(t => t.Id == id)
                      ?? throw ServiceApplicationException.NotFound($"Teacher needed to create a group");
        var groupExists = await db.Groups.AnyAsync(g => g.Name == groupDto.ClassNumber);
        if (groupExists)
            throw ServiceApplicationException.Forbidden($"Class Already Exists: {groupDto.ClassNumber}");
        var group = new Group(groupDto.ClassNumber, teacher);
        await db.Groups.AddAsync(group);
        await db.SaveChangesAsync();

        var teacherRepsonse = new TeacherResponse(teacher.Id, teacher.FirstName, teacher.LastName, group.Name);

        return teacherRepsonse;
    }


    public async Task<List<TeacherResponse>> GetGroupByNameAsync(string groupName)
    {
        logger.LogDebug("Fetching group with the the group name {GroupName}", groupName);
        var groupResponse = await db.Groups.Include(g => g.Teacher)
            .Where(g => g.Name.Value.StartsWith(groupName))
            .Select(g => new TeacherResponse(g.Teacher.Id, g.Teacher.FirstName, g.Teacher.LastName, g.Name))
            .ToListAsync();
        logger.LogInformation("Fetched teacher with the group name {GroupName}", groupName);
        return groupResponse;
    }

    public async Task DeleteGroupAsync(int id)
    {
        logger.LogDebug("Deleting group with id {GroupId}", id);

        var group = db.Groups.Find(id) ?? throw ServiceApplicationException.NotFound("Group not found");
        db.Groups.Remove(group);
        await db.SaveChangesAsync();

        logger.LogInformation("Deleted group with id {GroupId}", id);
    }


    public async Task<List<TeacherResponse>> GetTeachersAsync()
    {
        var groups = await db.Groups.Include(g => g.Teacher).Select(g =>
            new TeacherResponse(g.Teacher.Id, g.Teacher.FirstName, g.Teacher.LastName, g.Name)).ToListAsync();
        return groups;
    }

// Create a Student
    public async Task<StudentResponse> CreateStudentAsync(CreateStudentDto studentDto)
    {
        logger.LogDebug("Create new Student with email {Email}", studentDto.Email);

        var student = new Student(
            studentDto.FirstName,
            studentDto.LastName,
            studentDto.Email
        );

        db.Students.Add(student);
        await db.SaveChangesAsync();

        var studentResponse = new StudentResponse(
            student.Id,
            student.FirstName,
            student.LastName,
            null
        );

        logger.LogInformation("Create new student with id {StudentId}", student.Id);
        return studentResponse;
    }

// Get all student
    public async Task<List<StudentResponse>> GetAllStudentsAsync()
    {
        logger.LogDebug("Fetching all students");

        var studentResponse = await db.Students
            .AsNoTracking()
            .Select(s => new StudentResponse(
                s.Id,
                s.FirstName,
                s.LastName,
                db.Groups
                    .Where(g => g.Id == s.Group!.Id)
                    .Select(g => g.Name)
                    .FirstOrDefault()
            ))
            .ToListAsync();

        logger.LogInformation("Fetched all students");
        return studentResponse;
    }

//Gets a student with their groups by ID
    public async Task<List<StudentResponse>> GetStudentsByIdAsync(int id)
    {
        logger.LogDebug("Fetching student with the firstname {StudentId}", id);

        var studentResponse = await db.Students
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new StudentResponse(
                s.Id,
                s.FirstName,
                s.LastName,
                db.Groups
                    .Where(g => g.Id == s.Group!.Id)
                    .Select(g => g.Name)
                    .FirstOrDefault()
            ))
            .ToListAsync();

        logger.LogInformation("Fetched student with the firstname {StudentId}", id);
        return studentResponse;
    }

//Gets a student with their groups by name
    public async Task<List<StudentResponse>> SearchStudentsByNameAsync(string lastName)
    {
        logger.LogDebug("Fetching student with the lastname {StudentLastName}", lastName);

        var studentResponse = await db.Students
            .AsNoTracking()
            .Where(s => s.LastName.StartsWith(lastName))
            .Select(s => new StudentResponse(
                s.Id,
                s.FirstName,
                s.LastName,
                db.Groups
                    .Where(g => g.Id == s.Group!.Id)
                    .Select(g => g.Name)
                    .FirstOrDefault()
            ))
            .ToListAsync();

        logger.LogInformation("Fetched student with the firsname {StudentFirstname}", lastName);
        return studentResponse;
    }
    
    
    
    
}
