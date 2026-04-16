using System.ComponentModel.DataAnnotations;
using Application.Models.ValueObjects;

namespace Application.ViewModels.PatchDtos;

public record PatchGroupDto
{
    [Required]
    public ClassNumber? ClassNumber { get; init; }
}