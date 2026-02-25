using Application.Models.Enitities;
using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.Models.Users;

using System.Text.RegularExpressions;

public class UserBase : EntityBase
{
    private static readonly Regex ValidPattern =
        new(@"^[a-zA-Z]+$", RegexOptions.Compiled);
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public EMailAddress Email { get; set; }
    public Role Role { get; set; }

    public UserBase(string firstName, string lastName, EMailAddress email, Role role)
    {

        firstName = firstName.Trim();
        lastName = lastName.Trim();

        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentNullException.ThrowIfNull(email);

        if (!ValidPattern.IsMatch(firstName))
            throw new ArgumentException("First name should contain letters only", nameof(firstName));
        if(!ValidPattern.IsMatch(lastName))
            throw new ArgumentException("Last name should contain letters only", nameof(lastName));

        if (firstName.Length is > 100 or < 1 )
            throw new ArgumentException("First name should be between 1 and 100 letters", nameof(firstName));
        if ( lastName.Length is > 100 or < 1 )
            throw new ArgumentException("Last name should be between 1 and 100 letters", nameof(lastName));
     
        if(!Enum.IsDefined(typeof(Role), role))
            throw new ArgumentException("Role should be a valid role", nameof(role));

        FirstName = firstName.Trim();
        LastName = lastName.Trim();
        Email = email;
        Role = role;
    }
}