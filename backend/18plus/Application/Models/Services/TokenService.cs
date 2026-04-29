using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Models.Users;
using Microsoft.IdentityModel.Tokens;
using SpengerbiteApi.Exceptions;

namespace Application.Models.Services;

public class TokenService : ITokenService
{
    //IConfiguration ist ein Objekt, mit dem man Einstellungen
    //(z.B. appsettings.json) aus einer Konfigurationsdatei
    //oder Umgebung auslesen kann.
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(UserBase user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.PublicId.ToString()),
            new Claim(ClaimTypes.Email, user.Email.Value),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var jwtKey = _config["Jwt:Key"]
            ?? throw ServiceApplicationException.InternalServerError("Jwt:Key ist nicht konfiguriert");
        var issuer = _config["Jwt:Issuer"]
            ?? throw ServiceApplicationException.InternalServerError("Jwt:Issuer fehlt");
        var audience = _config["Jwt:Audience"]
            ?? throw ServiceApplicationException.InternalServerError("Jwt:Audience fehlt");
        var expiryHours = int.TryParse(_config["Jwt:ExpiryHours"], out var configuredExpiryHours)
                          && configuredExpiryHours > 0
            ? configuredExpiryHours
            : 2;

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expiryHours),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
