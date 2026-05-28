using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.Models.Users;
using Microsoft.IdentityModel.Tokens;
using SpengerbiteApi.Exceptions;

namespace Application.Models.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;
    private readonly IJwtKeyProvider _jwtKeyProvider;

    public TokenService(IConfiguration config, IJwtKeyProvider jwtKeyProvider)
    {
        _config = config;
        _jwtKeyProvider = jwtKeyProvider;
    }

    public string GenerateAdminToken(UserBase user)
    {
        var jwtKey = _config["Jwt:Key"]
            ?? throw ServiceApplicationException.InternalServerError("Jwt:Key ist nicht konfiguriert");

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        return GenerateJwtToken(user, key, DateTime.UtcNow.AddHours(2));
    }

    public string GenerateTeacherAccessToken(UserBase user)
    {
        var key = _jwtKeyProvider.GetTeacherKey();

        return GenerateJwtToken(user, key, DateTime.UtcNow.AddHours(2));
    }

    public string GenerateStudentAccessToken(UserBase user)
    {
        var key = _jwtKeyProvider.GetTeacherKey();

        return GenerateJwtToken(user, key, DateTime.UtcNow.AddHours(2));
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);

        return Convert.ToBase64String(randomBytes);
    }

    public string HashRefreshToken(string refreshToken)
    {
        var bytes = SHA256.HashData(
            Encoding.UTF8.GetBytes(refreshToken)
        );

        return Convert.ToBase64String(bytes);
    }

    private string GenerateJwtToken(UserBase user, SecurityKey key, DateTime expires)
    {
        var issuer = _config["Jwt:Issuer"]
            ?? throw ServiceApplicationException.InternalServerError("Jwt:Issuer ist nicht konfiguriert");

        var audience = _config["Jwt:Audience"]
            ?? throw ServiceApplicationException.InternalServerError("Jwt:Audience ist nicht konfiguriert");

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.PublicId.ToString()),
            new Claim(ClaimTypes.Email, user.Email.Value),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
