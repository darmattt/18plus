using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Application.Models.ValueObjects;

namespace Application.ViewModels.CreateDtos;

public class record
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