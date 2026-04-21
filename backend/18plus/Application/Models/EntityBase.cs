namespace Application.Models.Enitities;

public abstract class EntityBase : IEquatable<EntityBase>
{
    public int Id { get; protected set; }              // DB Primary Key
    public Guid PublicId { get; protected set; } = Guid.NewGuid(); // öffen    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; protected internal set; }
    public int? CreatedBy { get; protected internal set; }
    public int? UpdatedBy { get; protected internal set; }
    public DateTime CreatedAt { get; protected internal set; } = DateTime.UtcNow;

    protected EntityBase() { }

    public void MarkUpdated(int? updatedBy = null)
    {
        UpdatedAt = DateTime.UtcNow;
        UpdatedBy = updatedBy;
    }

    public override bool Equals(object? obj) =>
        obj is EntityBase other && Equals(other);

    public bool Equals(EntityBase? other) =>
        ReferenceEquals(this, other) ||
        (other is not null && Id != 0 && other.Id == Id);

    public override int GetHashCode() =>
        Id.GetHashCode();
}