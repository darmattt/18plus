using System.ComponentModel.DataAnnotations;
using Application.Models.ValueObjects;

namespace Application.ViewModels.LoginDtos;

public class RequestStudentLoginCodeDto
{
    [Required]
    public EMailAddress EmailAddress { get; init; } = null!;
}
