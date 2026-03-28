using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.Models.Users;

public class Teacher : UserBase
{
    protected Teacher(){}

    public Teacher(string firstName, string lastName, EMailAddress email, PasswordHash passwordHash, PhoneNumber? phoneNumber = null) : base(firstName, lastName, email, passwordHash, phoneNumber)
    {
        Role = Role.Teacher;
    }
}
