using Application.Models.Enums;

namespace Application.Models.Users;

public class Admin : UserBase
{
    public Admin(string firstName, string lastName, string email, Role role, PasswordHash password) : base(firstName, lastName, email, role)
    {
        Password = password;
    }

    public PasswordHash Password { get; set; }
    
}