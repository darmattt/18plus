using System.ComponentModel.DataAnnotations;

namespace Application.ViewModels.CreateDtos;

public record SetGroupWorksheetsDto
(
    [Required] List<string> Slugs,
    bool Enabled
);
