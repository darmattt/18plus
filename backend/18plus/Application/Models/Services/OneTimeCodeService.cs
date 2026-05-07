using System.Security.Cryptography;
using System.Text;
using Application.Models.Enitities;
using Application.Models.Users;
using Application.ViewModels.CreateDtos;

namespace Application.Models.Services;

public class OneTimeCodeService : IOneTimeCodeService
{
    private readonly byte[] _secretKey;

    public OneTimeCodeService(IConfiguration configuration)
    {
        var secret = configuration["Otp:SecretKey"];
        if (string.IsNullOrWhiteSpace(secret))
            throw new InvalidOperationException("Otp:SecretKey is missing.");

        _secretKey = Encoding.UTF8.GetBytes(secret);
    }

    public CreatedOneTimeCode Create(Student student, TimeSpan lifetime)
    {
        ArgumentNullException.ThrowIfNull(student);

        var plainCode = GenerateCode();
        var hash = HashCode(plainCode);

        var entity = new OneTimeCode(
            student,
            hash
        );

        return new CreatedOneTimeCode(entity, plainCode);
    }

    public bool Verify(OneTimeCode oneTimeCode, string plainCode)
    {
        ArgumentNullException.ThrowIfNull(oneTimeCode);
        ArgumentException.ThrowIfNullOrWhiteSpace(plainCode);
        
        var computedHash = HashCode(plainCode.Trim());

        var isValid = oneTimeCode.VerifyHash(computedHash);
        return isValid;
    }

    private string HashCode(string code)
    {
        using var hmac = new HMACSHA256(_secretKey);
        var bytes = Encoding.UTF8.GetBytes(code);
        var hash = hmac.ComputeHash(bytes);
        return Convert.ToHexString(hash);
    }

    private static string GenerateCode()
    {
        int number = RandomNumberGenerator.GetInt32(0, 1_000_000);
        return number.ToString("D6");
    }
}