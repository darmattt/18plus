using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

namespace Application.Models.Services;

public class JwtKeyProvider : IJwtKeyProvider
{
    private readonly byte[] _teacherKey;

    public JwtKeyProvider()
    {
        _teacherKey = RandomNumberGenerator.GetBytes(64);
    }

    public SymmetricSecurityKey GetTeacherKey()
    {
        return new SymmetricSecurityKey(_teacherKey);
    }
}