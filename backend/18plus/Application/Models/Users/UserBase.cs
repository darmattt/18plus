using System.Text.RegularExpressions;
using Application.Models.Enitities;
using Application.Models.Enums;
using Application.Models.Exception;
using Application.Models.ValueObjects;

namespace Application.Models.Users;

public abstract class UserBase : EntityBase
{
    private static readonly Regex ValidPattern =
        new(@"^(?=.{1,50}$)[\p{L}]+(?:[ '-][\p{L}]+)*$", RegexOptions.Compiled);
    public string FirstName { get; protected internal set; } = null!;
    public string LastName { get; protected internal set; } = null!;
    public EMailAddress Email { get; protected internal set; } = null!;
    public Role Role { get; protected set; }
    public PasswordHash? PasswordHash { get; protected internal set; } = null!;
    public PhoneNumber? PhoneNumber { get; protected internal set; } = null!;
    protected UserBase() { }

    protected UserBase(string firstName, string lastName, EMailAddress email)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentNullException.ThrowIfNull(email);

        firstName = firstName.Trim();
        lastName = lastName.Trim();

        if (!ValidPattern.IsMatch(firstName))
            throw new DomainBusinessValidationException($"Invalid first name: {firstName}");

        if (!ValidPattern.IsMatch(lastName))
            throw new DomainBusinessValidationException($"Invalid last name: {lastName}");

        FirstName = firstName;
        LastName = lastName;
        Email = email;
    }
    
    protected UserBase(string firstName, string lastName, EMailAddress email, PasswordHash passwordHash, PhoneNumber? phoneNumber = null)
        : this(firstName, lastName, email)
    {
        ArgumentNullException.ThrowIfNull(passwordHash);
        PasswordHash = passwordHash;
        PhoneNumber = phoneNumber;
    }}