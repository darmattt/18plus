using Application.Models.Enitities;
using Application.Models.Enums;

namespace Application.Models.Users;

public class UserBase : EntityBase
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public Role Role { get; set; }
}