using Application.Models.Enitities;
using Application.Models.Users;
using Application.Models.ValueObjects;
using Xunit;

namespace Application.test.EntitiesTests;

public class GroupWorksheetTests
{
    [Fact]
    public void Constructor_Should_Create_Object_When_Values_Are_Valid()
    {
        var group = CreateGroup();
        var worksheet = CreateWorksheet();

        var groupWorksheet = new GroupWorksheet(group, worksheet);

        Assert.NotNull(groupWorksheet);
        Assert.Equal(group, groupWorksheet.Group);
        Assert.Equal(worksheet, groupWorksheet.Worksheet);
        Assert.False(groupWorksheet.IsEnabled);
        Assert.Null(groupWorksheet.EnabledAt);
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Group_Is_Null()
    {
        var worksheet = CreateWorksheet();

        Assert.Throws<ArgumentNullException>(() =>
            new GroupWorksheet(null!, worksheet));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Worksheet_Is_Null()
    {
        var group = CreateGroup();

        Assert.Throws<ArgumentNullException>(() =>
            new GroupWorksheet(group, null!));
    }

    [Fact]
    public void Enable_Should_Set_IsEnabled_To_True()
    {
        var groupWorksheet = new GroupWorksheet(CreateGroup(), CreateWorksheet());

        groupWorksheet.Enable();

        Assert.True(groupWorksheet.IsEnabled);
    }

    [Fact]
    public void Enable_Should_Set_EnabledAt()
    {
        var groupWorksheet = new GroupWorksheet(CreateGroup(), CreateWorksheet());

        groupWorksheet.Enable();

        Assert.NotNull(groupWorksheet.EnabledAt);
    }

    [Fact]
    public void Enable_Should_Set_EnabledAt_To_Current_Time()
    {
        var groupWorksheet = new GroupWorksheet(CreateGroup(), CreateWorksheet());

        var before = DateTime.UtcNow;
        groupWorksheet.Enable();
        var after = DateTime.UtcNow;

        Assert.True(groupWorksheet.EnabledAt >= before);
        Assert.True(groupWorksheet.EnabledAt <= after);
    }

    [Fact]
    public void Enable_Should_Throw_Exception_When_Already_Enabled()
    {
        var groupWorksheet = new GroupWorksheet(CreateGroup(), CreateWorksheet());

        groupWorksheet.Enable();

        Assert.Throws<InvalidOperationException>(() => groupWorksheet.Enable());
    }

    [Fact]
    public void Disable_Should_Set_IsEnabled_To_False()
    {
        var groupWorksheet = new GroupWorksheet(CreateGroup(), CreateWorksheet());
        groupWorksheet.Enable();

        groupWorksheet.Disable();

        Assert.False(groupWorksheet.IsEnabled);
    }

    [Fact]
    public void Disable_Should_Not_Reset_EnabledAt()
    {
        var groupWorksheet = new GroupWorksheet(CreateGroup(), CreateWorksheet());
        groupWorksheet.Enable();
        var enabledAt = groupWorksheet.EnabledAt;

        groupWorksheet.Disable();

        Assert.Equal(enabledAt, groupWorksheet.EnabledAt);
    }

    [Fact]
    public void Disable_Should_Throw_Exception_When_Already_Disabled()
    {
        var groupWorksheet = new GroupWorksheet(CreateGroup(), CreateWorksheet());

        Assert.Throws<InvalidOperationException>(() => groupWorksheet.Disable());
    }

    private static Group CreateGroup()
    {
        var teacher = new Teacher(
            "Max",
            "Mustermann",
            new EMailAddress("teacher@test.at"),
            new PasswordHash("hashedPassword"),
            new PhoneNumber("06641234567"));

        return new Group(new ClassNumber("6BAIF"), teacher);
    }

    private static Worksheet CreateWorksheet()
    {
        return new Worksheet("Mathe Blatt 1", "Addition und Subtraktion");
    }
}