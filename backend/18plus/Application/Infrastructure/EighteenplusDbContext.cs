using Application.Models.Enitities;
using Application.Models.Users;
using Microsoft.EntityFrameworkCore;
// Mapping: Wie C# Klassen zur Datenbank passen
// Migration: Wie Änderungen im Code in die Datenbank übernommen werden.
namespace Application.Infrastructure;

//Die Konfigurationssdaten für DbCotext
public class EighteenplusDbContext(DbContextOptions<EighteenplusDbContext> options) 
    : DbContext(options) 
{
    //Wir sagen dem 
    public DbSet<UserBase> Users => Set<UserBase>();
    public DbSet<Student> Students => Set<Student>();
    // public DbSet<Admin> Admins => Set<Admin>();
    // public DbSet<Group> Groups => Set<Group>();
    // public DbSet<Worksheet> Worksheets => Set<Worksheet>();
    // public DbSet<GroupWorksheet> GroupWorksheets => Set<GroupWorksheet>();
    // public DbSet<Result> Results => Set<Result>();
    // public DbSet<OneTimeCode> OneTimeCodes => Set<OneTimeCode>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {   //EF Core Standardkonfiguration holen.
        base.OnModelCreating(modelBuilder);
        //EF Core sucht automatisch nach allen Klassen im Projekt, die:
        //Nätig, weil wir separate Konfiguration haben. Wir machen das Ganze
        //damit, dbContext nicht riesig wird.
        //Durchsucht das ganze Projekt finde alle Klassen mit IEntityTypeConfiguraton<T>
        //Führe deren Configure() Methode aus.
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(EighteenplusDbContext).Assembly);
    }
}