using Application.Models;
using Application.Models.ValueObjects;
using BCrypt.Net;

public class PasswordHasherService
{
    public PasswordHash Hash(string plainPassword)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(plainPassword);

        var hash = BCrypt.Net.BCrypt.HashPassword(plainPassword);
        return new PasswordHash(hash);
    }

    public bool Verify(string plainPassword, PasswordHash passwordHash)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(plainPassword);

        return BCrypt.Net.BCrypt.Verify(plainPassword, passwordHash.Value);
    }
}