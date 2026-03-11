using Application.Models.Enitities;
using Application.Models.Enums;
using Application.Models.Users;
using Application.Models.ValueObjects;
using Xunit;

namespace Application.test.EntitiesTests;

public class ResultTests
{
    [Fact]
    public void Constructor_Should_Create_Object_When_Values_Are_Valid()
    {
        var student = CreateStudent();
        var worksheet = CreateWorksheet();

        var result = new Result("{\"q1\":\"A\"}", student, worksheet);

        Assert.NotNull(result);
        Assert.Equal("{\"q1\":\"A\"}", result.AnswersJson);
        //Assert.Equal(student, result.Student);
        Assert.Equal(worksheet, result.Worksheet);
        Assert.Equal(WorkingStatus.InProgress, result.Status);
        Assert.Null(result.SubmittedAt);
    }

    [Fact]
    public void Constructor_Should_Trim_AnswersJson()
    {
        var student = CreateStudent();
        var worksheet = CreateWorksheet();

        var result = new Result("  {\"q1\":\"A\"}  ", student, worksheet);

        Assert.Equal("{\"q1\":\"A\"}", result.AnswersJson);
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_AnswersJson_Is_Null()
    {
        var student = CreateStudent();
        var worksheet = CreateWorksheet();

        Assert.Throws<ArgumentNullException>(() => new Result(null!, student, worksheet));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_Exception_When_AnswersJson_Is_Empty(string input)
    {
        var student = CreateStudent();
        var worksheet = CreateWorksheet();

        Assert.Throws<ArgumentException>(() => new Result(input, student, worksheet));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Student_Is_Null()
    {
        var worksheet = CreateWorksheet();

        Assert.Throws<ArgumentNullException>(() => new Result("{\"q1\":\"A\"}", null!, worksheet));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Worksheet_Is_Null()
    {
        var student = CreateStudent();

        Assert.Throws<ArgumentNullException>(() => new Result("{\"q1\":\"A\"}", student, null!));
    }

    [Fact]
    public void Submit_Should_Set_SubmittedAt()
    {
        var student = CreateStudent();
        var worksheet = CreateWorksheet();
        var result = new Result("{\"q1\":\"A\"}", student, worksheet);

        result.Submit();

        Assert.NotNull(result.SubmittedAt);
    }

    [Fact]
    public void Submit_Should_Set_Status_To_Submitted()
    {
        var student = CreateStudent();
        var worksheet = CreateWorksheet();
        var result = new Result("{\"q1\":\"A\"}", student, worksheet);

        result.Submit();

        Assert.Equal(WorkingStatus.Submitted, result.Status);
    }

    [Fact]
    public void Submit_Should_Set_SubmittedAt_To_Current_Time()
    {
        var student = CreateStudent();
        var worksheet = CreateWorksheet();
        var result = new Result("{\"q1\":\"A\"}", student, worksheet);

        var before = DateTime.UtcNow;
        result.Submit();
        var after = DateTime.UtcNow;

        Assert.True(result.SubmittedAt >= before);
        Assert.True(result.SubmittedAt <= after);
    }

    private static Student CreateStudent()
    {
        return new Student(
            "Max",
            "Mustermann",
            new EMailAddress("student@test.at")
        );
    }

    private static Worksheet CreateWorksheet()
    {
        return new Worksheet(
            "Mathe Blatt 1",
            "Addition und Subtraktion"
        );
    }
}