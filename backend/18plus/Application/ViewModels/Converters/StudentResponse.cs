using Application.Models.Enitities;
using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.ViewModels.Converters;

public record StudentResponse(
    int Id,
    string Firstname,
    string Lastname,
    ClassNumber? Group
    );