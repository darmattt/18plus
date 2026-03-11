using System.Security.Cryptography;
using Application.Models.Users;

namespace Application.Models.Enitities;

public class OneTimeCode
{
    public int Id { get; protected set; }
    
    public string Code { get; protected set; }
    public DateTime ExpiresAt { get; protected set; }
    public bool IsUsed { get; protected set; }
   // public Student Student { get; protected set; }

    protected OneTimeCode() { }

    public OneTimeCode(Student student)
    {
        ArgumentNullException.ThrowIfNull(student);

        Code = GenerateCode();
        ExpiresAt = DateTime.UtcNow.AddMinutes(10);
        //Student = student;
        IsUsed = false;
    }

    private static string GenerateCode()
    {
        int number = RandomNumberGenerator.GetInt32(0, 1000000);
        return number.ToString("D6");
    }

    public void MarkAsUsed()
    {
        if (IsUsed)
            throw new InvalidOperationException("Code already used");

        IsUsed = true;
    }
}