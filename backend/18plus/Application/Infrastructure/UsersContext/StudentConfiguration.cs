using Application.Models.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Application.Infrastructure.UsersContext;

public class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    
    // CREATE TABLE "Students" (
    // "Id" INTEGER NOT NULL CONSTRAINT "UserId" PRIMARY KEY,
    // "GroupId" INTEGER NULL,
    // CONSTRAINT "FK_Students_Groups_GroupId" FOREIGN KEY ("GroupId") REFERENCES "Groups" ("Id") ON DELETE SET NULL,
    // CONSTRAINT "FK_Students_Users_Id" FOREIGN KEY ("Id") REFERENCES "Users" ("Id") ON DELETE CASCADE
    // );
    
    public void Configure(EntityTypeBuilder<Student> builder)
    {
        builder.ToTable("Students");
        builder.HasOne(x => x.Group)
            .WithMany()
            .HasForeignKey("GroupId")
            .OnDelete(DeleteBehavior.SetNull);
    }
}