using System.Xml.Schema;
using Application.Models.Enitities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Application.Infrastructure.EntitiesContext;

public class ResultConfiguration : IEntityTypeConfiguration<Result>
{
    
    // CREATE TABLE "Results" (
    // "Id" INTEGER NOT NULL CONSTRAINT "PK_Results" PRIMARY KEY AUTOINCREMENT,
    // "AnswersJson" TEXT NOT NULL,
    // "SubmittedAt" TEXT NOT NULL,
    // "StudentId" INTEGER NOT NULL,
    // "WorksheetId" INTEGER NOT NULL,
    // "Status" INTEGER NOT NULL,
    // "PublicId" TEXT NOT NULL,
    // "UpdatedAt" TEXT NULL,
    // "CreatedBy" INTEGER NULL,
    // "UpdatedBy" INTEGER NULL,
    // "CreatedAt" TEXT NOT NULL,
    // CONSTRAINT "FK_Results_Students_StudentId" FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE, 
    // CONSTRAINT "FK_Results_Worksheets_WorksheetId" FOREIGN KEY ("WorksheetId") REFERENCES "Worksheets" ("Id") ON DELETE CASCADE
    // );
    
    public void Configure(EntityTypeBuilder<Result> builder)
    {
        builder.Property(x => x.Id)
            .HasColumnName("Id");
        builder.Property(x => x.AnswersJson)
            .HasColumnName("AnswersJson")
            .IsRequired();
        builder.Property(x => x.SubmittedAt)
            .HasColumnName("SubmittedAt")
            .IsRequired(false);
        builder.HasOne(x => x.Student)
            .WithMany()
            .HasForeignKey("StudentId");
        builder.HasOne(x => x.Worksheet)
            .WithMany()
            .HasForeignKey("WorksheetId");
    }
}