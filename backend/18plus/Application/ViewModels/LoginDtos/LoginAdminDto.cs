using System.ComponentModel.DataAnnotations;
using Application.Models.ValueObjects;

namespace Application.ViewModels.LoginDtos;

public record LoginAdminDto
{
    [Required]
    public EMailAddress EmailAddress { get; init; }
    [Required]
    public string Password { get; init; }
}