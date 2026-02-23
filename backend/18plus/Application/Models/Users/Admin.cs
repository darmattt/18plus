namespace Application.Models.Users;

public class Admin : UserBase
{
    public PasswordHash Password { get; set; }
    
}