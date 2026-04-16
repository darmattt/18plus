using Application.Models.Users;
using Application.Models.ValueObjects;

namespace Application.Models.Services;

public interface IPasswordService
{
    
    PasswordHash Hash(string plainPassword);
    bool Verify(UserBase user, string plainText);
}