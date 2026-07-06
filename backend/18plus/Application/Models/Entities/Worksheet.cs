using Application.Models.Enitities;
using Application.Models.Exception;

namespace Application.Models.Entities;

public class Worksheet : EntityBase
{
    public string Name { get; protected set; }
    public string Type { get; protected set; }
    public string Slug { get; protected set; }

    public Worksheet(string name, string? type, string slug)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentException.ThrowIfNullOrWhiteSpace(slug);

        name = name.Trim();

        type = type?.Trim() ?? "";

        slug = slug.Trim();

        ArgumentOutOfRangeException.ThrowIfGreaterThan(name.Length, 100);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(type.Length, 1000);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(slug.Length, 100);

        Name = name;
        Type = type;
        Slug = slug;
    }

}