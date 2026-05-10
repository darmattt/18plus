using System.Security.Cryptography;
using Application.Models.Enitities;
using Application.Models.Enums;
using Application.Models.Exception;
using Application.Models.Users;
using Application.Models.ValueObjects;

namespace Application.Models.Entities;

public  class Group : EntityBase
{
    public ClassNumber Name {get; set; } 
    public string JoinCode {get; protected set;}
    public UserBase Teacher {get; protected set;}
    
    private static readonly Random Random = new();

    public Group(ClassNumber name, UserBase teacher)
    {
        ArgumentNullException.ThrowIfNull(name);
        ArgumentNullException.ThrowIfNull(teacher);
        
        if(teacher.Role != Role.Teacher)
            throw new DomainBusinessValidationException($"User must be teacher.");
        
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