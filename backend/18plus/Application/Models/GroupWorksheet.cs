namespace Application.Models;

public class GroupWorksheet
{
    public Group Group { get; set; }
    public Worksheet Worksheet { get; set; }
    public bool IsEnabled { get; set; }
    public DatenTime? EnabledAt { get; set; }
}