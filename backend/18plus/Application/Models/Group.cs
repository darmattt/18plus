using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Application.Models;

public class Group : EntityBase
{
    public ClassNumber Name {get; init;}
    public int JoinCode {get; init;}
    public Teacher Teacher {get; init;}
    private List<Student> _students = [];
    public IEnumerable<Student> Students => Students.AsReadOnly();
}