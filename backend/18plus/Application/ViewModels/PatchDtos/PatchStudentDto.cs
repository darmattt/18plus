using System.ComponentModel.DataAnnotations;
using Application.Models.Entities;
using Application.Models.ValueObjects;

namespace Application.ViewModels.PatchDtos;

public class PatchStudentDto
{
    [Required]
    [StringLength(50, MinimumLength = 1)]
    public string? FirstName { get; init; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 1)] 
    public string? LastName { get; init; } =  string.Empty;

    [Required] 
    public EMailAddress? Email { get; init; } = default!;
    
    public Group? Group { get; init; }
}