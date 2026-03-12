using Application.Models.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Application.Infrastructure.UsersContext;

public class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    public void Configure(EntityTypeBuilder<Student> builder)
    {
        builder.ToTable("Students");
        builder.HasOne(x => x.Group)
            .WithMany()
            .HasForeignKey("GroupId")
            .OnDelete(DeleteBehavior.SetNull);
    }
}