    using Application.Models.Users;
    using Microsoft.AspNetCore.Identity;
    using Application.Models.ValueObjects;
    using SpengerbiteApi.Exceptions;

    namespace Application.Models.Services;

    public class PasswordService(PasswordHasher<UserBase> passwordHasher) : IPasswordService
    { 
        public PasswordHash Hash(string plainPassword)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(plainPassword);

            var result = Zxcvbn.Core.EvaluatePassword(plainPassword);
            if (result.Score < 3)
                throw ServiceApplicationException.BadRequest($"Password is too weak: {plainPassword}");
            var passwordHash = passwordHasher.HashPassword(null!,plainPassword);
            return new PasswordHash(passwordHash);
        }

        public bool Verify(UserBase user,  string plaintext)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(plaintext);
            ArgumentNullException.ThrowIfNull(user);

            var result = passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash.Value,
                plaintext
            );
            return result != PasswordVerificationResult.Failed;
        }
    }