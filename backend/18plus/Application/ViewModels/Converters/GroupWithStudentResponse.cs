using Application.Models.ValueObjects;

namespace Application.ViewModels.Converters;

public record GroupWithStudentsResponse(
    int Id,
    ClassNumber Name,
    string JoinCode,
    List<StudentItemResponse> Students
);