using System.Text.Json;
using System.Text.Json.Serialization;
using Application.Models.ValueObjects;

namespace Application.ViewModels.Converters;

public class PhoneNumberConverter : JsonConverter<PhoneNumber>
{
    public override PhoneNumber? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        new PhoneNumber(reader.GetString());

    public override void Write(Utf8JsonWriter writer, PhoneNumber value, JsonSerializerOptions options) =>
        writer.WriteStringValue(value.Value);
    
}