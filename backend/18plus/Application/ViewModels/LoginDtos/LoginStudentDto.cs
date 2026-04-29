using System.ComponentModel.DataAnnotations;
using Application.Models.ValueObjects;

namespace Application.ViewModels.LoginDtos;

public class LoginStudentDto
{
    [Required]
    public EMailAddress EmailAddress { get; init; }
    
    [Required]
    public string OneTimeCode { get; init; }
}