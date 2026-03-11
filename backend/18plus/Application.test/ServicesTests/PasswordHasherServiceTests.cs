namespace Application.test.ServicesTests;

public class PasswordHasherServiceTests
{
    [Fact]
    public void Hash_Should_Return_PasswordHash()
    {
        var service = new PasswordHasherService();

        var result = service.Hash("Start123!");

        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result.Value));
    }

    [Fact]
    public void Verify_Should_Return_True_When_Password_Is_Correct()
    {
        var service = new PasswordHasherService();
        var hash = service.Hash("Start123!");

        var result = service.Verify("Start123!", hash);

        Assert.True(result);
    }

    [Fact]
    public void Verify_Should_Return_False_When_Password_Is_Wrong()
    {
        var service = new PasswordHasherService();
        var hash = service.Hash("Start123!");

        var result = service.Verify("Falsch123!", hash);

        Assert.False(result);
    }

    [Fact]
    public void Hash_Should_Throw_Exception_When_Password_Is_Null()
    {
        var service = new PasswordHasherService();

        Assert.Throws<ArgumentNullException>(() => service.Hash(null!));
    }
}