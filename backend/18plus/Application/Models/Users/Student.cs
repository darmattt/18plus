using Application.Models.Enitities;

namespace Application.Models.Users;

public class Student : UserBase
{
    public Group? Group { get; set; }
}