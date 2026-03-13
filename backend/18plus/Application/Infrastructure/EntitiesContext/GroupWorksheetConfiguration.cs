using Application.Models.Enitities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Application.Infrastructure.EntitiesContext;

public class GroupWorksheetConfiguration : IEntityTypeConfiguration<GroupWorksheet>
{
    
    // CREATE TABLE "GroupWorksheets" (
    // "GroupId" INTEGER NOT NULL,
    // "WorksheetId" INTEGER NOT NULL,
    // "IsEnabled" INTEGER NOT NULL,
    // "EnabledAt" TEXT NOT NULL,
    // CONSTRAINT "PK_GroupWorksheets" PRIMARY KEY ("GroupId", "WorksheetId"),
    // CONSTRAINT "FK_GroupWorksheets_Groups_GroupId" FOREIGN KEY ("GroupId") REFERENCES "Groups" ("Id") ON DELETE CASCADE, 
    // CONSTRAINT "FK_GroupWorksheets_Worksheets_WorksheetId" FOREIGN KEY ("WorksheetId") REFERENCES "Worksheets" ("Id") ON DELETE CASCADE
    // );
    //
    public void Configure(EntityTypeBuilder<GroupWorksheet> builder)
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
}