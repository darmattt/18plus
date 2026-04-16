using System.Security.Cryptography;
using Application.Models.Exception;
using Application.Models.Users;

namespace Application.Models.Enitities;

public class OneTimeCode : EntityBase
{
    public string CodeHash { get; protected set; }
    public DateTime ExpiresAt { get; protected set; }
    public DateTime? UsedAt { get; protected set; }
    public Student Student { get; protected set; }

    protected OneTimeCode() { }

    public OneTimeCode(Student student, string codeHash)
    {
        ArgumentNullException.ThrowIfNull(student);
        ArgumentException.ThrowIfNullOrWhiteSpace(codeHash);

        Student = student;
        CodeHash = codeHash;
        ExpiresAt = DateTime.Now.AddMinutes(5);
    }

    public bool IsUsed => UsedAt is not null;
    public bool IsExpired => DateTime.UtcNow > ExpiresAt;

    public void MarkAsUsed()
    {
        if (IsUsed)
            throw new DomainBusinessValidationException("Code already used.");

        UsedAt = DateTime.UtcNow;
    }

    public bool VerifyHash(string computedHash)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(computedHash);

        if (IsUsed || IsExpired)
            return false;

        var isValid = CryptographicOperations.FixedTimeEquals(
            Convert.FromHexString(CodeHash),
            Convert.FromHexString(computedHash)
        );

        if (isValid)
            UsedAt = DateTime.UtcNow;

        return isValid;
    }
}