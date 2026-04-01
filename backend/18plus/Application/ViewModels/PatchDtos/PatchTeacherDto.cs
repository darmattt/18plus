using System.ComponentModel.DataAnnotations;
using Application.Models.ValueObjects;

namespace Application.ViewModels.PatchDtos;

public record PatchTeacherDto
{
    [StringLength(50, MinimumLength = 1)] 
    public string? FirstName { get; init; }

    [StringLength(50, MinimumLength = 1)]
    public string? LastName { get; init; } 
    
    public EMailAddress? Email { get; init; } 

    // optional beim Update!
    [MinLength(8)]
    public string? Password { get; init; }

    public PhoneNumber? PhoneNumber { get; init; } 
}