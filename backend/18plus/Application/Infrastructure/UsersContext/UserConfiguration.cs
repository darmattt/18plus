using Application.Models.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Application.Infrastructure.UsersContext;

public class UserConfiguration : IEntityTypeConfiguration<UserBase>
{
    
    // CREATE TABLE "Users" (
    // "Id" INTEGER NOT NULL CONSTRAINT "UserId" PRIMARY KEY,
    // "FirstName" TEXT NOT NULL,
    // *LastName" TEXT NOT NULL,
    // "Email" TEXT NOT NULL,
    // "Role" TEXT NOT NULL,
    // "PasswordHash" TEXT NOT NULL,
    // "PhoneNumber" TEXT NULL,
    // "PublicId" TEXT NOT NULL,
    // "UpdatedAt" TEXT NULL,
    // "CreatedBy" INTEGER NULL,
    // "UpdatedBy" INTEGER NULL,
    // *CreatedAt" TEXT NOT NULL
    // );
    
    public void Configure(EntityTypeBuilder<UserBase> builder)
    {
        builder.ToTable("Users");
        builder.UseTptMappingStrategy();
        builder.HasKey(x => x.Id)
            .HasName("UserId");
        //First Name Property
        builder.Property(x => x.FirstName)
            .IsRequired()
            .HasMaxLength(50);
        //Last Name Property
        builder.Property(x => x.LastName)
            .IsRequired()
            .HasMaxLength(50);
        //Email Property
        builder.OwnsOne(x => x.Email, email =>
        {
            email.Property(x => x.Value)
                .HasColumnName("Email")
                .IsRequired();
            email.HasIndex(x => x.Value)
                .IsUnique();
        });
        //PasswordHash Property
        builder.OwnsOne(x => x.PasswordHash, hash =>
        {
            hash.Property(x => x.Value)
                .HasColumnName("PasswordHash")
                .IsRequired();
            hash.HasIndex(x => x.Value);
        });
        //Phone number Property
        builder.OwnsOne(x => x.PhoneNumber, number =>
        {
            number.Property(x => x.Value)
                .HasColumnName("PhoneNumber")
                .IsRequired();
            number.HasIndex(x => x.Value);
        });
        //Role Property
        builder.Property(x => x.Role)
            .HasConversion<string>()
            .IsRequired();
    }
}