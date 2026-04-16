using System.Text.RegularExpressions;
using Application.Models.Exception;

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
            throw new DomainBusinessValidationException($"Invalid Austrian phone number format: {value}" );

        Value = Regex.Replace(value, @"\s+", "");
    }
}