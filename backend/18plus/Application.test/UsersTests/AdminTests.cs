using Application.Models.Enums;
using Application.Models.Users;
using Application.Models.ValueObjects;
using Xunit;

namespace Application.test.UsersTests;

public class AdminTests
{
    [Fact]
    public void Constructor_Should_Create_Admin_When_Values_Are_Valid()
    {
        var email = new EMailAddress("admin@test.at");
        var passwordHash = new PasswordHash("hashedPassword");

        var admin = new Admin("Max", "Mustermann", email, passwordHash);

        Assert.NotNull(admin);
        Assert.Equal("Max", admin.FirstName);
        Assert.Equal("Mustermann", admin.LastName);
        Assert.Equal(email, admin.Email);
        Assert.Equal(passwordHash, admin.PasswordHash);
        Assert.Equal(Role.Admin, admin.Role);
    }

    [Fact]
    public void Constructor_Should_Set_Role_To_Admin()
    {
        var email = new EMailAddress("admin@test.at");
        var passwordHash = new PasswordHash("hashedPassword");

        var admin = new Admin("Max", "Mustermann", email, passwordHash);

        Assert.Equal(Role.Admin, admin.Role);
    }

    [Fact]
    public void Constructor_Should_Trim_FirstName_And_LastName()
    {
        var email = new EMailAddress("admin@test.at");
        var passwordHash = new PasswordHash("hashedPassword");

        var admin = new Admin("  Max  ", "  Mustermann  ", email, passwordHash);

        Assert.Equal("Max", admin.FirstName);
        Assert.Equal("Mustermann", admin.LastName);
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_FirstName_Is_Null()
    {
        var email = new EMailAddress("admin@test.at");
        var passwordHash = new PasswordHash("hashedPassword");

        Assert.Throws<ArgumentNullException>(() =>
            new Admin(null!, "Mustermann", email, passwordHash));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_LastName_Is_Null()
    {
        var email = new EMailAddress("admin@test.at");
        var passwordHash = new PasswordHash("hashedPassword");

        Assert.Throws<ArgumentNullException>(() =>
            new Admin("Max", null!, email, passwordHash));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Email_Is_Null()
    {
        var passwordHash = new PasswordHash("hashedPassword");

        Assert.Throws<ArgumentNullException>(() =>
            new Admin("Max", "Mustermann", null!, passwordHash));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_PasswordHash_Is_Null()
    {
        var email = new EMailAddress("admin@test.at");

        Assert.Throws<ArgumentNullException>(() =>
            new Admin("Max", "Mustermann", email, null!));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_Exception_When_FirstName_Is_Empty(string input)
    {
        var email = new EMailAddress("admin@test.at");
        var passwordHash = new PasswordHash("hashedPassword");

        Assert.Throws<ArgumentException>(() =>
            new Admin(input, "Mustermann", email, passwordHash));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_Exception_When_LastName_Is_Empty(string input)
    {
        var email = new EMailAddress("admin@test.at");
        var passwordHash = new PasswordHash("hashedPassword");

        Assert.Throws<ArgumentException>(() =>
            new Admin("Max", input, email, passwordHash));
    }

    [Theory]
    [InlineData("Max123")]
    [InlineData("Anna!")]
    [InlineData("John@")]
    public void Constructor_Should_Throw_Exception_When_FirstName_Is_Invalid(string firstName)
    {
        var email = new EMailAddress("admin@test.at");
        var passwordHash = new PasswordHash("hashedPassword");

        Assert.Throws<ArgumentException>(() =>
            new Admin(firstName, "Mustermann", email, passwordHash));
    }

    [Theory]
    [InlineData("Mustermann1")]
    [InlineData("Müller!")]
    [InlineData("Test@Name")]
    public void Constructor_Should_Throw_Exception_When_LastName_Is_Invalid(string lastName)
    {
        var email = new EMailAddress("admin@test.at");
        var passwordHash = new PasswordHash("hashedPassword");

        Assert.Throws<ArgumentException>(() =>
            new Admin("Max", lastName, email, passwordHash));
    }

    [Theory]
    [InlineData("Müller")]
    [InlineData("Jean-Luc")]
    [InlineData("O'Connor")]
    [InlineData("van der Bellen")]
    public void Constructor_Should_Create_Admin_When_LastName_Is_Valid(string lastName)
    {
        var email = new EMailAddress("admin@test.at");
        var passwordHash = new PasswordHash("hashedPassword");

        var admin = new Admin("Max", lastName, email, passwordHash);

        Assert.Equal(lastName, admin.LastName);
    }

    [Theory]
    [InlineData("Anna")]
    [InlineData("José")]
    [InlineData("Jean-Luc")]
    [InlineData("O'Connor")]
    public void Constructor_Should_Create_Admin_When_FirstName_Is_Valid(string firstName)
    {
        var email = new EMailAddress("admin@test.at");
        var passwordHash = new PasswordHash("hashedPassword");

        var admin = new Admin(firstName, "Mustermann", email, passwordHash);

        Assert.Equal(firstName, admin.FirstName);
    }
}