using System.ComponentModel.DataAnnotations;
using Application.Models.Enitities;

namespace Application.ViewModels.CreateDtos;

public record CreatedOneTimeCode(OneTimeCode OneTimeCode, string PlainCode);