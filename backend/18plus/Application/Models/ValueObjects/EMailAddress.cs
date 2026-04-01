using Application.Models.Exception;
using EmailValidation;

namespace Application.Models.ValueObjects;

public sealed record EMailAddress
{
    public string Value {get; init; }
 
    protected EMailAddress() {}
    public EMailAddress(string value)
    {
        
        ArgumentException.ThrowIfNullOrWhiteSpace(value);
        
        value = value.Trim();
    
         if(!EmailValidator.Validate(
                value,
                false, //Domain muss mindestens einen Punkt enthalten
                false //Keine Umlaute und keine andere Sprachen
                )
            )
             throw new ArgumentException("Please enter a valid email address.");
         
        Value = value;
    }

}