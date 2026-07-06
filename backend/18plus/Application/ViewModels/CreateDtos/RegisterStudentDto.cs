using System.ComponentModel.DataAnnotations;
using Application.Models.ValueObjects;

namespace Application.ViewModels.CreateDtos;

public class RegisterStudentDto
{
    [Required]
    public string FirstName { get; init; } = null!;

    [Required]
    public string LastName { get; init; } = null!;

    [Required]
    public EMailAddress Email { get; init; } = null!;

    [Required]
    public string JoinCode { get; init; } = null!;
}
