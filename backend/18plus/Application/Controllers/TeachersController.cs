using Application.Infrastructure;
using Application.Models.Services;
using Application.Models.Users;
using Application.Models.ValueObjects;
using Application.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeachersController(EighteenplusDbContext db, ILogger<TeachersController> logger, PasswordHasherService passwordHasher) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<Teacher>> CreateNewTeacher([FromBody] CreateTeacherDto request)
    {
        var teacher = new Teacher(
            request.FirstName,
            request.LastName,
            request.Email,
            passwordHasher.Hash(request.Password),
            new PhoneNumber(request.PhoneNumber)
        );
            await db.Teachers.AddAsync(teacher);
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateNewTeacher), new { id = teacher.Id }, teacher);
    }
    
    
    
}
