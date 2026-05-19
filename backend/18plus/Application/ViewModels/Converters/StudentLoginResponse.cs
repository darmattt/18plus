namespace Application.ViewModels.Converters;

public record StudentLoginResponse
(
    bool RequiresOneTimeCode,
    string? Message,
    StudentResponse? Student
);
