using Application.Models.ValueObjects;
using Xunit.Sdk;

namespace Application.test.ValueObjectsTests;

public class ClassNumberTests
{
    [Theory]
    [InlineData("6")]
    [InlineData("6b")]
    [InlineData("6BAIF")]
    [InlineData("6baif")]
    [InlineData(" 6baf ")]
    public void Constructor_Should_Create_Object_When_ClassNumber_Is_Valid(string input)
    {
        var Classnumber = new ClassNumber(input);
        Assert.NotNull(Classnumber);
    }

    [Fact]
    public void Constructor_Should_Convert_To_Uppercase()
    {
        var result = new ClassNumber("6baif");
        Assert.Equal("6BAIF", result.Value);
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Null()
    {
        Assert.Throws<ArgumentNullException>(() => new ClassNumber(null!));
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    public void Constructor_Should_Throw_Exception_When_Empty_String(string input)
    {
        Assert.Throws<ArgumentException>(() => new ClassNumber(input));
    }

    [Theory]
    [InlineData("BAIF6")]
    [InlineData("BAIF")]
    [InlineData("B6")]
    public void Constructor_Should_Throw_Exception_When_First_Char_Not_Number(string input)
    {
        Assert.Throws<ArgumentException>(() => new ClassNumber(input));
    }
    
    [Theory]
    [InlineData("6BAIF_")]
    [InlineData("6BAIF-")]
    [InlineData("6BAIF!")]
    public void Constructor_Should_Throw_Exception_When_Invalid_Characters(string input)
    {
        Assert.Throws<ArgumentException>(() => new ClassNumber(input));
    }
    
    [Fact]
    public void Constructor_Should_Throw_Exception_When_Too_Long()
    {
        var input = "5BAIFGHIJKL"; // 11 Zeichen

        Assert.Throws<ArgumentException>(() => new ClassNumber(input));
    }
    
    [Fact]
    public void Two_ClassNumbers_With_Same_Value_Should_Be_Equal()
    {
        var a = new ClassNumber("5baif");
        var b = new ClassNumber("5BAIF");

        Assert.Equal(a, b);
    }
    
    
}