using System.ComponentModel.DataAnnotations;

namespace Application.ViewModels.CreateDtos;

public record SaveResultDto
(
    [Required] string AnswersJson,
    bool Submit = false
);
