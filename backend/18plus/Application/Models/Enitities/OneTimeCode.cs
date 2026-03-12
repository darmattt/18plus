using System.Security.Cryptography;
using Application.Models.Users;

namespace Application.Models.Enitities;

public class OneTimeCode : EntityBase
{
    public string CodeHash { get; protected set; }
    public DateTime ExpiresAt { get; protected set; }
    public DateTime? UsedAt{ get; protected set; }
    public Student Student { get; protected set; }

    protected OneTimeCode() { }

    public OneTimeCode(Student student, string plainCode)
    {
        ArgumentNullException.ThrowIfNull(student);
        ArgumentException.ThrowIfNullOrEmpty(plainCode);

        CodeHash = HashCodeValue(plainCode.Trim());
        ExpiresAt = DateTime.UtcNow.AddMinutes(10);
        Student = student;
    }

    public bool IsUsed => UsedAt is not null;

    public void MarkAsUsed()
    {
        if(IsUsed)
            throw new InvalidOperationException("Already used");
        UsedAt = DateTime.UtcNow;
    }

    public bool VerifyCode(string plainCode)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(plainCode);
     
        if(IsUsed)
            return false;
        
        if(ExpiresAt < DateTime.UtcNow)
            return false;
        
        var hash = HashCodeValue(plainCode);
        return hash == CodeHash;
    }

    private static string HashCodeValue(string code)
    {
        var bytes = System.Text.Encoding.UTF8.GetBytes(code);
        var hash =  SHA256.HashData(bytes);
        return Convert.ToHexString(hash);
    }
    private static string GenerateCode()
    {
        int number = RandomNumberGenerator.GetInt32(0, 1000000);
        return number.ToString("D6");
    }
    
}