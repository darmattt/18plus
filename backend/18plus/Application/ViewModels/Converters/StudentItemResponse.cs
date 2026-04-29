using Application.Models.ValueObjects;

namespace Application.ViewModels.Converters;

public record StudentItemResponse(
    int Id,
    string FirstName,
    string LastName,
    EMailAddress? Email
);