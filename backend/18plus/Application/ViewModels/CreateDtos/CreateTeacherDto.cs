using System.ComponentModel.DataAnnotations;
using Application.Models.ValueObjects;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Application.ViewModels.CreateDtos;

public record CreateTeacherDto
{
    [Required]
    [StringLength(50, MinimumLength = 1)]
    public string FirstName { get; init; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 1)] 
    public string LastName { get; init; } =  string.Empty;

    [Required] 
    public EMailAddress Email { get; init; } = default!;

    [Required]
    [MinLength(8)]
    public string Password { get; init; } = string.Empty;
    public PhoneNumber? PhoneNumber { get; init; } 
}