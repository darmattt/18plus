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
        
        if(name.Length > 100)
            throw new EighteenplusException("Worksheet name cannot be longer than 100 characters.");
        if(description.Length > 1000)
            throw new EighteenplusException("Description cannot be longer than 1000 characters.");
        Name = name;
        Description = description;
    }
    
}