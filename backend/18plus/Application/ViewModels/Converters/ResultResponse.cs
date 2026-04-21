using Application.Models.Enums;

namespace Application.ViewModels.Converters;

public record ResultResponse
(
    string FirstName,
    string LastName,
    WorkingStatus WorkingStatus
    );