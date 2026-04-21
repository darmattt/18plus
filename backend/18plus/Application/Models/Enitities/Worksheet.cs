using Application.Models.Exception;

namespace Application.Models.Enitities;

public class Worksheet : EntityBase
{
    public string Name { get; protected set; }
    public string Type { get; protected set; }

    public Worksheet(string name, string? type)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        
        name = name.Trim();
        
        type = type?.Trim() ?? "";
        
        ArgumentOutOfRangeException.ThrowIfGreaterThan(name.Length, 100);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(type.Length, 1000);

        Name = name;
        Type = type;
    }
    
}