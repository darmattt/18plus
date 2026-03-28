using System.Text.Json;
using System.Text.Json.Serialization;
using Application.Models.ValueObjects;

namespace Application.ViewModels.Converters;

public class EmailConverter : JsonConverter<EMailAddress>
{
    public override EMailAddress? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        new(reader.GetString());

    public override void Write(Utf8JsonWriter writer, EMailAddress email, JsonSerializerOptions options)
    {
        writer.WriteStringValue(email.Value);
    }
}