namespace Application.Models.ValueObjects;

public record PasswordHash
{
    public string Value {get;}

    protected  PasswordHash() { }
    public PasswordHash(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);
        Value = value.Trim();
    }
}