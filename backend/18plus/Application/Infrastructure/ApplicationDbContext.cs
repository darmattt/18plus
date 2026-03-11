using Application.Models.Users;
using Microsoft.EntityFrameworkCore;

namespace Application.Infrastructure;

public class ApplicationDbContext(DbContextOptions op) : DbContext(op)
{
    public DbSet<UserBase> Users => Set<UserBase>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserBase>().ToTable("Users");
    }
}