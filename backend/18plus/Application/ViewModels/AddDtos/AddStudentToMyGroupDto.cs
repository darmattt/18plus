using System.ComponentModel.DataAnnotations;
using Application.Models.ValueObjects;

namespace Application.ViewModels.AddDtos;

public record AddStudentToMyGroupDto
{
    [Required] 
    public EMailAddress EMailAddress { get; init; }
}