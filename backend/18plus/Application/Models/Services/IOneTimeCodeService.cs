using Application.Models.Entities;
using Application.Models.Users;
using Application.ViewModels.CreateDtos;

namespace Application.Models.Services;

public interface IOneTimeCodeService
{ 
    CreatedOneTimeCode Create(Student student, TimeSpan lifetime);
    bool Verify(OneTimeCode oneTimeCode, string plainCode);
}