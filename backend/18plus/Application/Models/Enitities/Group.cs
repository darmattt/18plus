using Application.Models.Records;
using Application.Models.Users;

namespace Application.Models.Enitities;

public  class Group : EntityBase
{
    public ClassNumber Name {get; init;}
    public int JoinCode {get; init;}
    public Teacher Teacher {get; init;}
    private readonly List<Student> _students = [];
    public IReadOnlyCollection<Student> Students => _students.AsReadOnly();
}