using Application.Models.Enitities;
using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.Models.Users;

public class Student : UserBase
{
    public Student(string firstName, string lastName, EMailAddress email, Role role, Group? group) : base(firstName, lastName, email, role)
    {
        Group = group;
    }

    public Group? Group { get; set; }
}