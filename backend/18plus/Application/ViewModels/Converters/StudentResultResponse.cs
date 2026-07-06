using Application.Models.Enums;

namespace Application.ViewModels.Converters;

public record StudentResultResponse
(
    string? AnswersJson,
    WorkingStatus? Status
);
