using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.Models.Users;

public class Teacher : UserBase
{
    public PhoneNumber? PhoneNumber {get; protected set;}
    protected Teacher(){}
    public Teacher(string firstName, string lastName, EMailAddress email, PasswordHash passwordHash, PhoneNumber phoneNumber) : base(firstName, lastName, email, passwordHash)
    {
        PhoneNumber = phoneNumber;
        Role =  Role.Teacher;
    }
    
}
