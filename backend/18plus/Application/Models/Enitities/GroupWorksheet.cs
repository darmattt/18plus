namespace Application.Models.Enitities;

public class GroupWorksheet
{
    public Group Group { get; set; }
    public Worksheet Worksheet { get; set; }
    public bool IsEnabled { get; set; }
    public DateTime? EnabledAt { get; set; }
}