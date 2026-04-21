using Application.Models.Users;

namespace Application.Models.Services;

public interface ITokenService
{
    string GenerateToken(UserBase user);
}