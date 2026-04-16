using System.Text.RegularExpressions;
using Application.Models.Exception;

namespace Application.Models.ValueObjects;

public sealed record ClassNumber
{
    private static readonly Regex ValidPattern =
        new(@"^[0-9][A-Za-z0-9]*$", RegexOptions.Compiled);

    public string Value { get; } 

    public ClassNumber(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);

        value = value.Trim().ToUpperInvariant();
        
        ArgumentOutOfRangeException.ThrowIfGreaterThanOrEqual(value.Length, 12, nameof(ClassNumber));
        
        if (!ValidPattern.IsMatch(value))
            throw new DomainBusinessValidationException(
                $"Invalid Class Number '{value}'. It must start with a digit and contain only letters and numbers (e.g. 6BAIF).");

        Value = value.ToUpper();
    }

    public override string ToString() => Value;
}
    