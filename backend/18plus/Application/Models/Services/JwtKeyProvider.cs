using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Application.Models.Services;

public class JwtKeyProvider : IJwtKeyProvider
{
    private readonly SymmetricSecurityKey _teacherKey;

    public JwtKeyProvider(IConfiguration configuration)
    {
        var teacherKey = configuration["Jwt:TeacherKey"] ?? configuration["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(teacherKey))
        {
            throw new InvalidOperationException("Jwt signing key is missing.");
        }

        _teacherKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(teacherKey));
    }

    public SymmetricSecurityKey GetTeacherKey()
    {
        return _teacherKey;
    }
}
