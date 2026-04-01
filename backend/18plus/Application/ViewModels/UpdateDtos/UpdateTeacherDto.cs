// using System.ComponentModel.DataAnnotations;
// using Application.Models.ValueObjects;
// namespace Application.ViewModels.UpdateDtos;
//
// public record UpdateTeacherDto
// {
//     [Required]
//     [StringLength(50, MinimumLength = 1)]
//     public string FirstName { get; init; } = string.Empty;
//
//     [Required]
//     [StringLength(50, MinimumLength = 1)]
//     public string LastName { get; init; } = string.Empty;
//
//     [Required]
//     public EMailAddress Email { get; init; } = default!;
//
//     // optional beim Update!
//     [MinLength(8)]
//     public string? Password { get; init; }
//
//     [Required]
//     public PhoneNumber? PhoneNumber { get; init; } 
// }