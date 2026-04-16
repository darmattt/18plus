using System.Text.Json;
using System.Text.Json.Serialization;
using Application.Models.ValueObjects;

namespace Application.ViewModels.Converters;

public class ClassNumberConverter :  JsonConverter<ClassNumber>
{
    public override ClassNumber? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        new(reader.GetString());
    
    public override void Write(Utf8JsonWriter writer, ClassNumber classNumber, JsonSerializerOptions options)
    {
        writer.WriteStringValue(classNumber.Value);
    }
}