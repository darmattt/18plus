using Application.Models.Enitities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Application.Infrastructure.EntitiesContext;

public class OneTimeCodeConfiguration : IEntityTypeConfiguration<OneTimeCode>
{
    public void Configure(EntityTypeBuilder<OneTimeCode> builder)
    {
        builder.ToTable("OneTimeCodes");
        builder.HasKey(x => x.Id)
            .HasName("TokenId");
        builder.Property(x => x.CodeHash)
            .IsRequired()
            .HasMaxLength(64);
        builder.Property(x => x.ExpiresAt)
            .IsRequired();
        builder.Property(x => x.UsedAt)
            .IsRequired(false);
        builder.HasOne(x => x.Student)
            .WithMany()
            .HasForeignKey("StudentId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}