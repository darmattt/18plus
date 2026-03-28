using System.Text.RegularExpressions;

namespace Application.Models.ValueObjects;

public class PhoneNumber
{
    private static readonly Regex ValidPattern =
        new(@"^(?:\+43|0)\s?[1-9](?:[\s]?\d){6,13}$", RegexOptions.Compiled);

    public string? Value { get; }

    public PhoneNumber(string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);

        value = value.Trim();

        if (!ValidPattern.IsMatch(value))
            throw new ArgumentException("Invalid Austrian phone number format.", nameof(value));

        Value = Regex.Replace(value, @"\s+", "");
    }
}