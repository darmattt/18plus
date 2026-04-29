using Application.Models.ValueObjects;

namespace Application.ViewModels.Converters;

public record GroupWithStudentsResponse(
    int Id,
    ClassNumber Name,
    List<StudentItemResponse> Students
);