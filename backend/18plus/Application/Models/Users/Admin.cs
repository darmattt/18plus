using System.ComponentModel.DataAnnotations;
using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.Models.Users;

public class Admin : UserBase
{
    protected Admin() { }
    public Admin(string firstName, string lastName, EMailAddress email, PasswordHash passwordHash) : base(firstName, lastName, email, passwordHash)
    {
        Role = Role.Admin;
    }
}