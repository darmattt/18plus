using Microsoft.IdentityModel.Tokens;

namespace Application.Models.Services;

public interface IJwtKeyProvider 
{
    SymmetricSecurityKey GetTeacherKey();
}