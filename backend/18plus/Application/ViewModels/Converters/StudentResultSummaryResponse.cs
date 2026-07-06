using Application.Models.Enums;

namespace Application.ViewModels.Converters;

public record StudentResultSummaryResponse
(
    string Slug,
    WorkingStatus Status
);
