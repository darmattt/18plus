using Application.Models.ValueObjects;
using Xunit;

namespace Application.test.ValueObjectsTests;

public class PhoneNumberTests
{
    [Theory]
    [InlineData("06641234567")]
    [InlineData("+436641234567")]
    [InlineData("+43 6641234567")]
    [InlineData("+43 664 1234567")]
    [InlineData("0676 1234567")]
    public void Constructor_Should_Create_Object_When_PhoneNumber_Is_Valid(string input)
    {
        var phoneNumber = new PhoneNumber(input);
        Assert.NotNull(phoneNumber);
    }

    [Fact]
    public void Constructor_Should_Remove_Whitespace()
    {
        var result = new PhoneNumber("+43 664 1234567");
        Assert.Equal("+436641234567", result.Value);
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Null()
    {
        Assert.Throws<ArgumentNullException>(() => new PhoneNumber(null!));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_Exception_When_Empty_String(string input)
    {
        Assert.Throws<ArgumentException>(() => new PhoneNumber(input));
    }

    [Theory]
    [InlineData("+44123456789")]
    [InlineData("123456789")]
    [InlineData("+4301234567")]
    [InlineData("0664/1234567")]
    [InlineData("+43-6641234567")]
    [InlineData("0664ABC123")]
    public void Constructor_Should_Throw_Exception_When_Invalid_Format(string input)
    {
        Assert.Throws<ArgumentException>(() => new PhoneNumber(input));
    }
}