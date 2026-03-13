using Application.Models.Enitities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Application.Infrastructure.EntitiesContext;

public class WorksheetConfiguration : IEntityTypeConfiguration<Worksheet>
{
    
    // CREATE TABLE "Worksheets" (
    // "Id" INTEGER NOT NULL CONSTRAINT "WorksheetId" PRIMARY KEY AUTOINCREMENT,
    // "Name" TEXT NOT NULL,
    // "Description" TEXT NOT NULL,
    // "PublicId" TEXT NOT NULL,
    // "UpdatedAt" TEXT NULL,
    // "CreatedBy" INTEGER NULL,
    // "UpdatedBy" INTEGER NULL,
    // "CreatedAt" TEXT NOT NULL
    // );
    
    public void Configure(EntityTypeBuilder<Worksheet> builder)
    {
        builder.HasKey(x => x.Id)
            .HasName("WorksheetId");
        builder.Property(x => x.Name)
            .HasColumnName("Name")
            .IsRequired();
        builder.Property(x => x.Description)
            .HasColumnName("Description")
            .IsRequired();
    }
}