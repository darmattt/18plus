using System.ComponentModel.DataAnnotations;
using Application.Models.ValueObjects;

namespace Application.ViewModels.CreateDtos;

public record CreateGroupDto()
{ 
  [Required]
  public ClassNumber ClassNumber { get; init; }
}