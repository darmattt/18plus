using Application.Models.Enums;
using Application.Models.Users;
using Application.Models.ValueObjects;
using Xunit;

namespace Application.test.UsersTests;

public class TeacherTests
{
    [Fact]
    public void Constructor_Should_Create_Teacher_When_Values_Are_Valid()
    {
        var email = new EMailAddress("teacher@test.at");
        var passwordHash = new PasswordHash("hashedPassword");
        var phone = new PhoneNumber("06641234567");

        var teacher = new Teacher("Max", "Mustermann", email, passwordHash, phone);

        Assert.NotNull(teacher);
        Assert.Equal("Max", teacher.FirstName);
        Assert.Equal("Mustermann", teacher.LastName);
        Assert.Equal(email, teacher.Email);
        Assert.Equal(passwordHash, teacher.PasswordHash);
        Assert.Equal(phone, teacher.PhoneNumber);
        Assert.Equal(Role.Teacher, teacher.Role);
    }

    [Fact]
    public void Constructor_Should_Set_Role_To_Teacher()
    {
        var teacher = CreateTeacher();

        Assert.Equal(Role.Teacher, teacher.Role);
    }

    [Fact]
    public void Constructor_Should_Set_PhoneNumber()
    {
        var phone = new PhoneNumber("06641234567");
        var teacher = new Teacher(
            "Max",
            "Mustermann",
            new EMailAddress("teacher@test.at"),
            new PasswordHash("hashedPassword"),
            phone);

        Assert.Equal(phone, teacher.PhoneNumber);
    }

    [Fact]
    public void Constructor_Should_Trim_FirstName_And_LastName()
    {
        var teacher = new Teacher(
            "  Max  ",
            "  Mustermann  ",
            new EMailAddress("teacher@test.at"),
            new PasswordHash("hashedPassword"),
            new PhoneNumber("06641234567"));

        Assert.Equal("Max", teacher.FirstName);
        Assert.Equal("Mustermann", teacher.LastName);
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_FirstName_Is_Null()
    {
        var email = new EMailAddress("teacher@test.at");
        var passwordHash = new PasswordHash("hashedPassword");
        var phone = new PhoneNumber("06641234567");

        Assert.Throws<ArgumentNullException>(() =>
            new Teacher(null!, "Mustermann", email, passwordHash, phone));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_LastName_Is_Null()
    {
        var email = new EMailAddress("teacher@test.at");
        var passwordHash = new PasswordHash("hashedPassword");
        var phone = new PhoneNumber("06641234567");

        Assert.Throws<ArgumentNullException>(() =>
            new Teacher("Max", null!, email, passwordHash, phone));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Email_Is_Null()
    {
        var passwordHash = new PasswordHash("hashedPassword");
        var phone = new PhoneNumber("06641234567");

        Assert.Throws<ArgumentNullException>(() =>
            new Teacher("Max", "Mustermann", null!, passwordHash, phone));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_PasswordHash_Is_Null()
    {
        var email = new EMailAddress("teacher@test.at");
        var phone = new PhoneNumber("06641234567");

        Assert.Throws<ArgumentNullException>(() =>
            new Teacher("Max", "Mustermann", email, null!, phone));
    }

    [Theory]
    [InlineData("Max123")]
    [InlineData("Anna!")]
    [InlineData("John@")]
    public void Constructor_Should_Throw_Exception_When_FirstName_Is_Invalid(string firstName)
    {
        var email = new EMailAddress("teacher@test.at");
        var passwordHash = new PasswordHash("hashedPassword");
        var phone = new PhoneNumber("06641234567");

        Assert.Throws<ArgumentException>(() =>
            new Teacher(firstName, "Mustermann", email, passwordHash, phone));
    }

    [Theory]
    [InlineData("Mustermann1")]
    [InlineData("Müller!")]
    [InlineData("Test@Name")]
    public void Constructor_Should_Throw_Exception_When_LastName_Is_Invalid(string lastName)
    {
        var email = new EMailAddress("teacher@test.at");
        var passwordHash = new PasswordHash("hashedPassword");
        var phone = new PhoneNumber("06641234567");

        Assert.Throws<ArgumentException>(() =>
            new Teacher("Max", lastName, email, passwordHash, phone));
    }

    private static Teacher CreateTeacher()
    {
        return new Teacher(
            "Max",
            "Mustermann",
            new EMailAddress("teacher@test.at"),
            new PasswordHash("hashedPassword"),
            new PhoneNumber("06641234567"));
    }
}