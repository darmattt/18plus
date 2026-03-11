using Application.Models.Enitities;
using Xunit;

namespace Application.test.EntitiesTests;

public class EntityBaseTests
{
    [Fact]
    public void Constructor_Should_Set_Id()
    {
        var entity = new TestEntity();

        Assert.NotEqual(1, entity.Id);
    }

    [Fact]
    public void Constructor_Should_Set_CreatedAt()
    {
        var before = DateTime.UtcNow;

        var entity = new TestEntity();

        var after = DateTime.UtcNow;

        Assert.True(entity.CreatedAt >= before);
        Assert.True(entity.CreatedAt <= after);
    }

    [Fact]
    public void UpdatedAt_Should_Be_Null_When_Entity_Is_Created()
    {
        var entity = new TestEntity();

        Assert.Null(entity.UpdatedAt);
    }

    [Fact]
    public void CreatedBy_Should_Be_Null_By_Default()
    {
        var entity = new TestEntity();

        Assert.Null(entity.CreatedBy);
    }

    [Fact]
    public void UpdatedBy_Should_Be_Null_By_Default()
    {
        var entity = new TestEntity();

        Assert.Null(entity.UpdatedBy);
    }

    private class TestEntity : EntityBase
    {
    }
}