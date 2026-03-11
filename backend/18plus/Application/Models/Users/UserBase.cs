using System.Text.RegularExpressions;
using Application.Models.Enitities;
using Application.Models.Enums;
using Application.Models.ValueObjects;

namespace Application.Models.Users;

public abstract class UserBase : EntityBase
{
    private static readonly Regex ValidPattern =
        new(@"^(?=.{1,50}$)[\p{L}]+(?:[ '-][\p{L}]+)*$", RegexOptions.Compiled);
    public string FirstName { get; protected set; } = null!;
    public string LastName { get; protected set; } = null!;
    public EMailAddress Email { get; protected set; } = null!;
    public Role Role { get; protected set; }
    public PasswordHash PasswordHash { get; protected set; } = null!;
    public PhoneNumber? PhoneNumber { get; protected set; } = null!;
    protected UserBase() { }

    protected UserBase(string firstName, string lastName, EMailAddress email)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentNullException.ThrowIfNull(email);

        firstName = firstName.Trim();
        lastName = lastName.Trim();

        if (!ValidPattern.IsMatch(firstName))
            throw new ArgumentException("Invalid first name.", nameof(firstName));

        if (!ValidPattern.IsMatch(lastName))
            throw new ArgumentException("Invalid last name.", nameof(lastName));

        FirstName = firstName;
        LastName = lastName;
        Email = email;
    }
    
    protected UserBase(string firstName, string lastName, EMailAddress email, PasswordHash passwordHash)
        : this(firstName, lastName, email)
    {
        ArgumentNullException.ThrowIfNull(passwordHash);
        PasswordHash = passwordHash;
    }
    protected UserBase(string firstName, string lastName, EMailAddress email, PasswordHash passwordHash, PhoneNumber? phoneNumber = null)
        : this(firstName, lastName, email)
    {
        ArgumentNullException.ThrowIfNull(passwordHash);
        ArgumentNullException.ThrowIfNull(phoneNumber);
        PasswordHash = passwordHash;
        PhoneNumber = phoneNumber;
    }}