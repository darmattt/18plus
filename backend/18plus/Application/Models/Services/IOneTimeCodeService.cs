using Application.Models.Enitities;
using Application.Models.Users;
using Application.ViewModels.CreateDtos;

namespace Application.Models.Services;

public interface IOneTimeCodeService
{ 
    CreateOnetimeCode Create(Student student, TimeSpan lifetime);
    bool Verify(OneTimeCode oneTimeCode, string plainCode);
}