using Application.Models.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata.Conventions.Infrastructure;

namespace Application.Infrastructure.UsersContext;

public class UserConfiguration : IEntityTypeConfiguration<UserBase>
{
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
            hash.HasIndex(x => x.Value)
                .IsUnique();
        });
        //Phone number Property
        builder.OwnsOne(x => x.PhoneNumber, number =>
        {
            number.Property(x => x.Value)
                .HasColumnName("PhoneNumber")
                .IsRequired();
            number.HasIndex(x => x.Value)
                .IsUnique();
        });
        //Role Property
        builder.Property(x => x.Role)
            .HasConversion<string>()
            .IsRequired();
    }
}