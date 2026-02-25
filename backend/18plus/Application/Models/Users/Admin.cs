using System.ComponentModel.DataAnnotations;
using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.Models.Users;

public class Admin : UserBase
{
    public Admin(string firstName, string lastName,EMailAddress email, Role role, PasswordHash password) : base(firstName, lastName, email, role)
    {
        Password = password;
    }

    public PasswordHash Password { get; set; }
    
}