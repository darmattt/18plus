using Application.Models.Users;
using Microsoft.AspNetCore.Identity;
using Application.Models.ValueObjects;

namespace Application.Models.Services;

public class PasswordHasherService : IPasswordHasherService
{
    private readonly IPasswordHasher<Object> _hasher;

    public PasswordHasherService(IPasswordHasher<Object> hasher)
    {
        _hasher = hasher;
    }

    public PasswordHash Hash(string plainPassword)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(plainPassword);

        var hash = _hasher.HashPassword(null!, plainPassword);
        return new PasswordHash(hash);
    }

    public bool Verify(string plainPassword, PasswordHash passwordHash)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(plainPassword);
        ArgumentNullException.ThrowIfNull(passwordHash);

        var result = _hasher.VerifyHashedPassword(null!, passwordHash.Value, plainPassword);

        return result == PasswordVerificationResult.Success
               || result == PasswordVerificationResult.SuccessRehashNeeded;
    }
}