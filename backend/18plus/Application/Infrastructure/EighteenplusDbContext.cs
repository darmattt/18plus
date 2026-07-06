using Application.Models.Entities;
using Application.Models.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

// Mapping: Wie C# Klassen zur Datenbank passen
// Migration: Wie Änderungen im Code in die Datenbank übernommen werden.
namespace Application.Infrastructure;

//Die Konfigurationsdaten für DbCotext
public class EighteenplusDbContext(DbContextOptions<EighteenplusDbContext> options) 
    : DbContext(options) 
{
    //Wir sagen dem 
    public DbSet<UserBase> Users => Set<UserBase>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<Worksheet> Worksheets => Set<Worksheet>();
    public DbSet<GroupWorksheet> GroupWorksheets => Set<GroupWorksheet>();
    public DbSet<Result> Results => Set<Result>();
    public DbSet<OneTimeCode> OneTimeCodes => Set<OneTimeCode>();
    public DbSet<Teacher> Teachers => Set<Teacher>();
    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {   //EF Core Standardkonfiguration holen.
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<UserBase>(ConfigureUser);
        modelBuilder.Entity<RefreshToken>();
        modelBuilder.Entity<Group>(ConfigureGroup);
        modelBuilder.Entity<Student>(ConfigureStudent);
        modelBuilder.Entity<GroupWorksheet>(ConfigureGroupWorksheet);
        modelBuilder.Entity<Result>(ConfigureResult);
        modelBuilder.Entity<OneTimeCode>(ConfigureOneTimeCode);
        modelBuilder.Entity<Worksheet>(ConfigureWorksheet);
    }
    private static void ConfigureUser(EntityTypeBuilder<UserBase> builder)
    {
        builder.ToTable("Users");
        builder.UseTptMappingStrategy();
        builder.HasKey(x => x.Id).HasName("UserId");
        //First Name Property
        builder.Property(x => x.FirstName).IsRequired().HasMaxLength(50);
        //Last Name Property
        builder.Property(x => x.LastName).IsRequired().HasMaxLength(50);
        //Email Property
        builder.OwnsOne(x => x.Email, email =>
        {
            email.Property(x => x.Value).HasColumnName("Email").IsRequired();
            email.HasIndex(x => x.Value).IsUnique();
        });
        //PasswordHash Property
        builder.OwnsOne(x => x.PasswordHash, hash =>
        {
            hash.Property(x => x.Value).HasColumnName("PasswordHash").IsRequired(); hash.HasIndex(x => x.Value);
        });
        //Phone number Property
        builder.OwnsOne(x => x.PhoneNumber, number =>
        { 
            number.Property(x => x.Value).HasColumnName("PhoneNumber").IsRequired();
            number.HasIndex(x => x.Value);
        });
        //Role Property
        builder.Property(x => x.Role).HasConversion<string>().IsRequired();
    }
    private static void ConfigureGroup(EntityTypeBuilder<Group> builder)
    {
        builder.ToTable("Groups");
        builder.HasKey(x => x.Id).HasName("GroupId");
        builder.OwnsOne(x => x.Name, name =>
        {
            name.Property(x => x.Value).IsRequired().HasMaxLength(6).HasColumnName("Name");
        });
        builder.Property(x => x.JoinCode).IsRequired().HasMaxLength(6);
        
        builder.HasIndex(x => x.JoinCode).IsUnique();
        
        builder.HasOne(x => x.Teacher).WithMany().HasForeignKey("TeacherId");
    }
    private static void ConfigureGroupWorksheet(EntityTypeBuilder<GroupWorksheet> builder)
    {
        builder.HasKey("GroupId", "WorksheetId");
        builder.HasOne(x => x.Group)
            .WithMany()
            .HasForeignKey("GroupId")
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.Worksheet)
            .WithMany()
            .HasForeignKey("WorksheetId")
            .OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.EnabledAt)
            .HasColumnName("EnabledAt");
        builder.Property(x => x.IsEnabled)
            .HasColumnName("IsEnabled")
            .IsRequired();
    }
    private static void ConfigureOneTimeCode(EntityTypeBuilder<OneTimeCode> builder)
    {
        builder.ToTable("OneTimeCodes");
        builder.HasKey(x => x.Id).HasName("TokenId");
        builder.Property(x => x.CodeHash).IsRequired().HasMaxLength(64);
        builder.Property(x => x.ExpiresAt).IsRequired();
        builder.Property(x => x.UsedAt).IsRequired(false);
        builder.HasOne(x => x.Student).WithMany().HasForeignKey("StudentId").OnDelete(DeleteBehavior.Cascade);
    }
    private static void ConfigureResult(EntityTypeBuilder<Result> builder)
    {
        builder.Property(x => x.Id).HasColumnName("Id");
        builder.Property(x => x.AnswersJson).HasColumnName("AnswersJson").IsRequired();
        builder.Property(x => x.SubmittedAt).HasColumnName("SubmittedAt").IsRequired(false);
        builder.HasOne(x => x.Student).WithMany().HasForeignKey("StudentId");
        builder.HasOne(x => x.Worksheet).WithMany().HasForeignKey("WorksheetId");
    }
    private static void ConfigureWorksheet(EntityTypeBuilder<Worksheet> builder)
    {
        builder.HasKey(x => x.Id).HasName("WorksheetId");
        builder.Property(x => x.Name).HasColumnName("Name").IsRequired();
        builder.Property(x => x.Type).HasColumnName("Description").IsRequired();
        builder.Property(x => x.Slug).HasColumnName("Slug").IsRequired().HasMaxLength(100);
        builder.HasIndex(x => x.Slug).IsUnique();
    }
    private static void ConfigureStudent(EntityTypeBuilder<Student> builder)
    {
        builder.ToTable("Students");
        builder.HasOne(x => x.Group).WithMany().HasForeignKey("GroupId").OnDelete(DeleteBehavior.SetNull);
    }
    
    
    
}
    
    