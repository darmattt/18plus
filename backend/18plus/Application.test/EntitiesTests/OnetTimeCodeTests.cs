using Application.Models.Enitities;
using Application.Models.Users;
using Application.Models.ValueObjects;
using Xunit;

namespace Application.test.EntitiesTests;

public class OneTimeCodeTests
{
    [Fact]
    public void Constructor_Should_Create_Object_When_Student_Is_Valid()
    {
        var student = CreateStudent();

        var code = new OneTimeCode(student);

        Assert.NotNull(code);
        Assert.Equal(student, code.Student);
        Assert.False(code.IsUsed);
        Assert.NotNull(code.Code);
    }

    [Fact]
    public void Constructor_Should_Generate_6_Digit_Code()
    {
        var student = CreateStudent();

        var code = new OneTimeCode(student);

        Assert.Equal(6, code.Code.Length);
    }

    [Fact]
    public void Constructor_Should_Generate_Code_With_Only_Digits()
    {
        var student = CreateStudent();

        var code = new OneTimeCode(student);

        Assert.Matches(@"^\d{6}$", code.Code);
    }

    [Fact]
    public void Constructor_Should_Set_Expiration_Time_In_Future()
    {
        var student = CreateStudent();

        var code = new OneTimeCode(student);

        Assert.True(code.ExpiresAt > DateTime.UtcNow);
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Student_Is_Null()
    {
        Assert.Throws<ArgumentNullException>(() =>
            new OneTimeCode(null!));
    }

    [Fact]
    public void MarkAsUsed_Should_Set_IsUsed_To_True()
    {
        var student = CreateStudent();
        var code = new OneTimeCode(student);

        code.MarkAsUsed();

        Assert.True(code.IsUsed);
    }

    [Fact]
    public void MarkAsUsed_Should_Throw_Exception_When_Code_Already_Used()
    {
        var student = CreateStudent();
        var code = new OneTimeCode(student);

        code.MarkAsUsed();

        Assert.Throws<InvalidOperationException>(() =>
            code.MarkAsUsed());
    }

    private static Student CreateStudent()
    {
        return new Student(
            "Max",
            "Mustermann",
            new EMailAddress("student@test.at")
        );
    }
}