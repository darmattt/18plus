using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.ViewModels.Converters;

public record TeacherResponse(
    int Id,
    string Firstname,
    string Lastname,
    ClassNumber? ClassNumber
    );       
