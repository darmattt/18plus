using Application.Models.Exception;
using EmailValidation;

namespace Application.Models.ValueObjects;

public sealed record EMailAddress
{
    public string Value {get; init; }
 
    public EMailAddress(string value)
    {
        
        ArgumentException.ThrowIfNullOrWhiteSpace(value);
        
        value = value.Trim();
        value = value.ToLowerInvariant();
    
         if(!EmailValidator.Validate(
                value,
                false, //Domain muss mindestens einen Punkt enthalten
                false //Keine Umlaute und keine andere Sprachen
                )
            )
             throw new DomainBusinessValidationException($"Please enter a valid email address: {value}");
         
        Value = value;
    }

}
