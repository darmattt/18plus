using System.ComponentModel.DataAnnotations;
using Application.Models.Entities;

namespace Application.ViewModels.CreateDtos;

public record CreatedOneTimeCode(OneTimeCode OneTimeCode, string PlainCode);