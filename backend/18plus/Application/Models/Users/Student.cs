using Application.Models.Enitities;
using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.Models.Users;

public class Student : UserBase
{
    // public Group? Group { get; protected set; }
    protected Student() { }
    
    public Student(string firstName, string lastName, EMailAddress email) : base(firstName, lastName, email)
    {
        Role = Role.Student;
    }
    

}