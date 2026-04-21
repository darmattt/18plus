using Application.Models.Enitities;
using Application.Models.Exception;
using Xunit;

namespace Application.test.EntitiesTests;

public class WorksheetTests
{
    [Fact]
    public void Constructor_Should_Create_Object_When_Values_Are_Valid()
    {
        var worksheet = new Worksheet("Mathe Blatt 1", "Addition und Subtraktion");

        Assert.NotNull(worksheet);
        Assert.Equal("Mathe Blatt 1", worksheet.Name);
        Assert.Equal("Addition und Subtraktion", worksheet.Type);
    }

    [Fact]
    public void Constructor_Should_Trim_Name_And_Description()
    {
        var worksheet = new Worksheet("  Mathe Blatt 1  ", "  Addition und Subtraktion  ");

        Assert.Equal("Mathe Blatt 1", worksheet.Name);
        Assert.Equal("Addition und Subtraktion", worksheet.Type);
    }

    [Fact]
    public void Constructor_Should_Set_Description_To_Empty_String_When_Null()
    {
        var worksheet = new Worksheet("Mathe Blatt 1", null!);

        Assert.Equal("Mathe Blatt 1", worksheet.Name);
        Assert.Equal(string.Empty, worksheet.Type);
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Name_Is_Null()
    {
        Assert.Throws<ArgumentNullException>(() => new Worksheet(null!, "Beschreibung"));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_Exception_When_Name_Is_Empty(string input)
    {
        Assert.Throws<ArgumentException>(() => new Worksheet(input, "Beschreibung"));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Name_Is_Too_Long()
    {
        var name = new string('A', 101);

        Assert.Throws<DomainBusinessValidationException>(() => new Worksheet(name, "Beschreibung"));
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Description_Is_Too_Long()
    {
        var description = new string('A', 1001);

        Assert.Throws<DomainBusinessValidationException>(() => new Worksheet("Mathe Blatt 1", description));
    }

    [Fact]
    public void Constructor_Should_Allow_Empty_Description()
    {
        var worksheet = new Worksheet("Mathe Blatt 1", "");

        Assert.Equal("Mathe Blatt 1", worksheet.Name);
        Assert.Equal(string.Empty, worksheet.Type);
    }

    [Fact]
    public void Constructor_Should_Trim_Description_To_Empty_When_Only_Whitespace()
    {
        var worksheet = new Worksheet("Mathe Blatt 1", "   ");

        Assert.Equal("Mathe Blatt 1", worksheet.Name);
        Assert.Equal(string.Empty, worksheet.Type);
    }
}