using System.Diagnostics;
using Application.Infrastructure;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.test;

public class ApplicationDbContextTests
{
    private ApplicationDbContext GetDatabase()
    {
        var connection = new SqliteConnection("DataSource=:memory:");
        connection.Open();

        var opt = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlite(connection)
            .LogTo(message => Debug.WriteLine(message), LogLevel.Information)
            .EnableSensitiveDataLogging()
            .Options;

        var db = new ApplicationDbContext(opt);

        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();

        return db;
    }
    [Fact]
    public void CreateDatabaseSuccessTest()
    {
        using var db = GetDatabase();
        Assert.True(db.Database.CanConnect());
    }
}