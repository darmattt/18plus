using Application.Models.Exception;

namespace Application.Models.Entities;

public class GroupWorksheet
{
    public Group Group { get; protected set; }
    public Worksheet Worksheet { get; protected set; }
    public bool IsEnabled { get; protected set; }
    public DateTime? EnabledAt { get; protected set; }

    protected GroupWorksheet() { }

    public GroupWorksheet(Group group, Worksheet worksheet)
    {
        ArgumentNullException.ThrowIfNull(group);
        ArgumentNullException.ThrowIfNull(worksheet);

        Group = group;
        Worksheet = worksheet;
        IsEnabled = false;
        EnabledAt = null;
    }

    public void Enable()
    {
        if (IsEnabled)
            throw new DomainBusinessValidationException("Worksheet is already enabled for this group.");

        IsEnabled = true;
        EnabledAt = DateTime.UtcNow;
    }

    public void Disable()
    {
        if (!IsEnabled)
            throw new DomainBusinessValidationException("Worksheet is already disabled for this group.");

        IsEnabled = false;
    }
}