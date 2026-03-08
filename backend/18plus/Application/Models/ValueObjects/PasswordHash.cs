namespace Application.Models.ValueObjects;

public record PasswordHash
{
    public string Value {get;}

    public PasswordHash(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);
        Value = value.Trim();
    }
}