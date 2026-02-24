using Application.Models.Enitities;
using Application.Models.Enums;

namespace Application.Models.Users;

public class Student : UserBase
{
    public Student(string firstName, string lastName, string email, Role role, Group? group) : base(firstName, lastName, email, role)
    {
        Group = group;
    }

    public Group? Group { get; set; }
}