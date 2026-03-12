using Application.Models.Enitities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Application.Infrastructure.EntitiesContext;

public class GroupConfiguration : IEntityTypeConfiguration<Group>
{
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        builder.ToTable("Groups");
        builder.HasKey(x => x.Id)
            .HasName("GroupId");
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnType("varchar(100)");


    }
}