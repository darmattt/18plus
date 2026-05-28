namespace Application.ViewModels.Converters;

public record StudentProfileResponse(
    string FirstName,
    string LastName,
    string EmailAddress,
    string? GroupName,
    string? TeacherName
);
