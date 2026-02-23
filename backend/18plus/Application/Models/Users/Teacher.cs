namespace Application.Models.Users;

public class Teacher : UserBase
{
    public PasswordHash { get; set; }
}