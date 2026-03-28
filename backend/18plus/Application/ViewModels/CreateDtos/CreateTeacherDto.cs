using Application.Models.ValueObjects;

namespace Application.ViewModels;

public class CreateTeacherDto
{
    public required string FirstName { get; set; } 
    public required string LastName { get;  set; } 
    public required EMailAddress Email { get;  set; }
    public required string Password { get; set; }
    public required string PhoneNumber { get; set; } = null!;
}