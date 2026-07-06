using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.ViewModels.Converters;

public record ResultResponse
(
    string FirstName,
    string LastName,
    ClassNumber? GroupName,
    string WorksheetName,
    DateTime? SubmittedAt,
    WorkingStatus Status
    );