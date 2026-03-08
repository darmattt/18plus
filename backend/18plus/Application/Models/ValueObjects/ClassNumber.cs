using System.Text.RegularExpressions;
namespace Application.Models.ValueObjects;

public sealed record ClassNumber
{
    private static readonly Regex ValidPattern =
        new(@"^[0-9][A-Z0-9]*$", RegexOptions.Compiled);
    public string Value {get;}

    public ClassNumber(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);

        value = value.Trim().ToUpperInvariant();

        if (value.Length >= 10)
            throw new ArgumentException("ClassNumber must be less than 10 characters.");

        if (!ValidPattern.IsMatch(value))
            throw new ArgumentException("ClassNumber must contain only letters and numbers.");

        Value = value;
    }

    public override string ToString() => Value;
}
    