using Application.Models.Enitities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Application.Infrastructure.EntitiesContext;

public class GroupConfiguration : IEntityTypeConfiguration<Group>
{
    
    // CREATE TABLE "Groups" (
    // "Id" INTEGER NOT NULL CONSTRAINT "GroupId" PRIMARY KEY AUTOINCREMENT,
    // "Name" TEXT NOT NULL,
    // "JoinCode" TEXT NOT NULL,
    // "TeacherId" INTEGER NOT NULL,
    // "PublicId" TEXT NOT NULL,
    // "UpdatedAt" TEXT NULL,
    // "CreatedBy" INTEGER NULL,
    // "UpdatedBy" INTEGER NULL,
    // "CreatedAt" TEXT NOT NULL,
    // CONSTRAINT "FK_Groups_Teacher_TeacherId" FOREIGN KEY ("TeacherId") REFERENCES "Teacher" ("Id") ON DELETE CASCADE
    // );
    
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        builder.ToTable("Groups");
        builder.HasKey(x => x.Id)
            .HasName("GroupId");
        builder.OwnsOne(x => x.Name, name =>
        {
            name.Property(x => x.Value)
                .IsRequired()
                .HasMaxLength(6)
                .HasColumnName("Name");
        });
        builder.Property(x => x.JoinCode)
            .IsRequired()
            .HasMaxLength(6);
        builder.HasIndex(x => x.JoinCode)
            .IsUnique();
        builder.HasOne(x => x.Teacher)
            .WithMany()
            .HasForeignKey("TeacherId");
    }
}