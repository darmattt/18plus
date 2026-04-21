using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.ViewModels.Converters;

public record TeacherLoginResponse(
    string Token,
    string  FirstName,
    string  LastName,
    EMailAddress  EmailAddress
);