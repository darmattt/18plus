using System.ComponentModel.DataAnnotations;

namespace Application.ViewModels.CreateDtos;

public record CreateWorksheetDto
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Type { get; set; }
}