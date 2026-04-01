using Application.Models.Users;
using Application.Models.ValueObjects;

namespace Application.Models.Services;

public interface IPasswordHasherService
{
    
    public PasswordHash Hash(string plainPassword);
    public bool Verify(string plainPassword, PasswordHash passwordHash);
}