using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Application.Models.ValueObjects;

namespace Application.ViewModels.CreateDtos;

public record CreateStudentDto
{
    [Required]
    [StringLength(50, MinimumLength = 1)]
    public string FirstName { get; init; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 1)] 
    public string LastName { get; init; } =  string.Empty;

    [Required] 
    public EMailAddress Email { get; init; } = default!;
    
}