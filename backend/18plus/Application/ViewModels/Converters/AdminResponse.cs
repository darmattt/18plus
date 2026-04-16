using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.ViewModels.Converters;

public record AdminResponse(
    string Firstname,
    string Lastname,
    Role Role
);