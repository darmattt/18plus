using Application.Models.Enitities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Application.Infrastructure.EntitiesContext;

public class OneTimeCodeConfiguration : IEntityTypeConfiguration<OneTimeCode>
{
    
    // CREATE TABLE "OneTimeCodes" (
    // "Id" INTEGER NOT NULL CONSTRAINT "TokenId" PRIMARY KEY AUTOINCREMENT,
    // "CodeHash" TEXT NOT NULL,
    // "ExpiresAt" TEXT NOT NULL,
    // "UsedAt" TEXT NULL,
    // "StudentId" INTEGER NOT NULL,
    // "PublicId" TEXT NOT NULL,
    // "UpdatedAt" TEXT NULL,
    // "CreatedBy" INTEGER NULL,
    // "UpdatedBy" INTEGER NULL,
    // "CreatedAt" TEXT NOT NULL,
    // CONSTRAINT "FK_OneTimeCodes_Students_StudentId" FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE
    // );
    
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