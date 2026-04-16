using Application.Models.Exception;

namespace Application.Models.Enitities;

public class Worksheet : EntityBase
{
    public string Name { get; protected set; }
    public string Description { get; protected set; }

    public Worksheet(string name, string? description)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        
        name = name.Trim();
        
        description = description?.Trim() ?? "";
        
        ArgumentOutOfRangeException.ThrowIfGreaterThan(name.Length, 100);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(description.Length, 1000);

        Name = name;
        Description = description;
    }
    
}