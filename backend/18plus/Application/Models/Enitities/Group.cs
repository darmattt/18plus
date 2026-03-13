using System.Security.Cryptography;
using Application.Models.Enums;
using Application.Models.Users;
using Application.Models.ValueObjects;

namespace Application.Models.Enitities;

public  class Group : EntityBase
{
    public ClassNumber Name {get; protected set; } 
    public string JoinCode {get; protected set;}
    public UserBase Teacher {get; protected set;}
    private static readonly Random Random = new();

    public Group(ClassNumber name, UserBase teacher)
    {
        ArgumentNullException.ThrowIfNull(name);
        ArgumentNullException.ThrowIfNull(teacher);
        
        if(teacher.Role != Role.Teacher)
            throw new ArgumentException("User must be teacher", nameof(teacher));
        
        Name = name;
        Teacher = teacher;
        JoinCode = GenerateJoinCode();
    }

    protected Group(){}
    private static string GenerateJoinCode()
    {
        int number = RandomNumberGenerator.GetInt32(0, 1000000);
        return number.ToString("D6");
    }
}