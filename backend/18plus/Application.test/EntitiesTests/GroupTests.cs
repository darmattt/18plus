using Application.Models;
using Application.Models.Enitities;
using Application.Models.Users;
using Application.Models.ValueObjects;
using Xunit;

namespace Application.test.EntitiesTests;

public class GroupTests
{
    [Fact]
    public void Constructor_Should_Create_Object_When_Values_Are_Valid()
    {
        var name = new ClassNumber("6BAIF");
        var teacher = CreateTeacher();

        var group = new Group(name, teacher);

        Assert.NotNull(group);
        Assert.Equal(name, group.Name);
        Assert.Equal(teacher, group.Teacher);
        Assert.NotNull(group.JoinCode);
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Name_Is_Null()
    {
        var teacher = CreateTeacher();

        Assert.Throws<ArgumentNullException>(() => new Group(null!, teacher));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Teacher_Is_Null()
    {
        var name = new ClassNumber("6BAIF");

        Assert.Throws<ArgumentNullException>(() => new Group(name, null!));
    }

    [Fact]
    public void Constructor_Should_Generate_JoinCode()
    {
        var name = new ClassNumber("6BAIF");
        var teacher = CreateTeacher();

        var group = new Group(name, teacher);

        Assert.False(string.IsNullOrWhiteSpace(group.JoinCode));
    }

    [Fact]
    public void Constructor_Should_Generate_JoinCode_With_Length_6()
    {
        var name = new ClassNumber("6BAIF");
        var teacher = CreateTeacher();

        var group = new Group(name, teacher);

        Assert.Equal(6, group.JoinCode.Length);
    }

    [Fact]
    public void Constructor_Should_Generate_JoinCode_With_Only_Digits()
    {
        var name = new ClassNumber("6BAIF");
        var teacher = CreateTeacher();

        var group = new Group(name, teacher);

        Assert.Matches(@"^\d{6}$", group.JoinCode);
    }

    [Fact]
    public void Two_Groups_Should_Have_Different_JoinCodes()
    {
        var name1 = new ClassNumber("6BAIF");
        var name2 = new ClassNumber("5BHIF");
        var teacher = CreateTeacher();

        var group1 = new Group(name1, teacher);
        var group2 = new Group(name2, teacher);

        Assert.NotEqual(group1.JoinCode, group2.JoinCode);
    }

    private static Teacher CreateTeacher()
    {
        return new Teacher(
            "Max",
            "Mustermann",
            new EMailAddress("max.mustermann@test.at"),
            new PasswordHash("hashed-password"),
            new PhoneNumber("06641234567")
        );
    }
}