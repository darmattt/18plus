using System.Text.RegularExpressions;
namespace Application.Models.ValueObjects;

public sealed record ClassNumber
{
    private static readonly Regex ValidPattern =
        new(@"^[a-zA-Z0-9]+$", RegexOptions.Compiled);
    
    public string Value {get;}

    public ClassNumber(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);

        value = value.Trim();

        if (value.Length >= 7)
            throw new ArgumentException("ClassNumber must be less than 7 characters.");

        if (!ValidPattern.IsMatch(value))
            throw new ArgumentException("ClassNumber must contain only letters and numbers.");

        Value = value;
    }

    public override string ToString() => Value;
}
    