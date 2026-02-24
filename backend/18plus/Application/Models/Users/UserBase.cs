using Application.Models.Enitities;
using Application.Models.Enums;

namespace Application.Models.Users;

public class UserBase : EntityBase
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public Role Role { get; set; }

    public UserBase(string firstName, string lastName, string email, Role role)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Role = role;
    }
    
    
}