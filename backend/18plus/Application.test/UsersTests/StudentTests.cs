using Application.Models.Enums;
using Application.Models.Users;
using Application.Models.ValueObjects;
using Xunit;

namespace Application.test.UsersTests;

public class StudentTests
{
    [Fact]
    public void Constructor_Should_Create_Student_When_Values_Are_Valid()
    {
        var email = new EMailAddress("student@test.at");

        var student = new Student("Max", "Mustermann", email);

        Assert.NotNull(student);
        Assert.Equal("Max", student.FirstName);
        Assert.Equal("Mustermann", student.LastName);
        Assert.Equal(email, student.Email);
        Assert.Equal(Role.Student, student.Role);
        Assert.Null(student.Group);
    }

    [Fact]
    public void Constructor_Should_Trim_FirstName_And_LastName()
    {
        var email = new EMailAddress("student@test.at");

        var student = new Student("  Max  ", "  Mustermann  ", email);

        Assert.Equal("Max", student.FirstName);
        Assert.Equal("Mustermann", student.LastName);
    }

    [Fact]
    public void Constructor_Should_Set_Role_To_Student()
    {
        var email = new EMailAddress("student@test.at");

        var student = new Student("Anna", "Müller", email);

        Assert.Equal(Role.Student, student.Role);
    }

    [Fact]
    public void Constructor_Should_Set_Group_To_Null_By_Default()
    {
        var email = new EMailAddress("student@test.at");

        var student = new Student("Anna", "Müller", email);

        Assert.Null(student.Group);
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_FirstName_Is_Null()
    {
        var email = new EMailAddress("student@test.at");

        Assert.Throws<ArgumentNullException>(() =>
            new Student(null!, "Mustermann", email));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_LastName_Is_Null()
    {
        var email = new EMailAddress("student@test.at");

        Assert.Throws<ArgumentNullException>(() =>
            new Student("Max", null!, email));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Email_Is_Null()
    {
        Assert.Throws<ArgumentNullException>(() =>
            new Student("Max", "Mustermann", null!));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_Exception_When_FirstName_Is_Empty(string input)
    {
        var email = new EMailAddress("student@test.at");

        Assert.Throws<ArgumentException>(() =>
            new Student(input, "Mustermann", email));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_Exception_When_LastName_Is_Empty(string input)
    {
        var email = new EMailAddress("student@test.at");

        Assert.Throws<ArgumentException>(() =>
            new Student("Max", input, email));
    }

    [Theory]
    [InlineData("Max123")]
    [InlineData("Anna!")]
    [InlineData("John@")]
    public void Constructor_Should_Throw_Exception_When_FirstName_Is_Invalid(string firstName)
    {
        var email = new EMailAddress("student@test.at");

        Assert.Throws<ArgumentException>(() =>
            new Student(firstName, "Mustermann", email));
    }

    [Theory]
    [InlineData("Mustermann1")]
    [InlineData("Müller!")]
    [InlineData("Test@Name")]
    public void Constructor_Should_Throw_Exception_When_LastName_Is_Invalid(string lastName)
    {
        var email = new EMailAddress("student@test.at");

        Assert.Throws<ArgumentException>(() =>
            new Student("Max", lastName, email));
    }

    [Theory]
    [InlineData("Müller")]
    [InlineData("Jean-Luc")]
    [InlineData("O'Connor")]
    [InlineData("van der Bellen")]
    public void Constructor_Should_Create_Student_When_LastName_Is_Valid(string lastName)
    {
        var email = new EMailAddress("student@test.at");

        var student = new Student("Max", lastName, email);

        Assert.Equal(lastName, student.LastName);
    }

    [Theory]
    [InlineData("Anna")]
    [InlineData("José")]
    [InlineData("Jean-Luc")]
    [InlineData("O'Connor")]
    public void Constructor_Should_Create_Student_When_FirstName_Is_Valid(string firstName)
    {
        var email = new EMailAddress("student@test.at");

        var student = new Student(firstName, "Mustermann", email);

        Assert.Equal(firstName, student.FirstName);
    }
}