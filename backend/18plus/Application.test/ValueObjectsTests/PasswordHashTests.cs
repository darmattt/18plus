using Application.Models;
using Application.Models.ValueObjects;
using Xunit;

namespace Application.test.ValueObjectsTests;

public class PasswordHashTests
{
    [Theory]
    [InlineData("$2b$11$abcdefghijklmnopqrstuv123456789012345678901234567")]
    [InlineData("hash123")]
    [InlineData("  hash123  ")]
    public void Constructor_Should_Create_Object_When_Value_Is_Valid(string input)
    {
        var passwordHash = new PasswordHash(input);

        Assert.NotNull(passwordHash);
    }

    [Fact]
    public void Constructor_Should_Trim_Value()
    {
        var result = new PasswordHash("  hash123  ");

        Assert.Equal("hash123", result.Value);
    }

    [Fact]
    public void Constructor_Should_Throw_Exception_When_Null()
    {
        Assert.Throws<ArgumentNullException>(() => new PasswordHash(null!));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_Exception_When_Empty_String(string input)
    {
        Assert.Throws<ArgumentException>(() => new PasswordHash(input));
    }

    [Fact]
    public void Two_PasswordHashes_With_Same_Value_Should_Be_Equal()
    {
        var a = new PasswordHash("hash123");
        var b = new PasswordHash("hash123");

        Assert.Equal(a, b);
    }
}