using Application.Models.Users;

namespace Application.Models.Services;

public interface ITokenService
{ 
    string GenerateAdminToken(UserBase user); 
    string GenerateTeacherAccessToken(UserBase user); 
    string GenerateRefreshToken();
    
    string HashRefreshToken(string refreshToken);
}