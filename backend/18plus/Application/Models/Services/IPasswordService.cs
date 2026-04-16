using Application.Models.Users;
using Application.Models.ValueObjects;

namespace Application.Models.Services;

public interface IPassowrdService
{
    
    PasswordHash Hash(string plainPassword);
    bool Verify(UserBase user, string plainText);
}