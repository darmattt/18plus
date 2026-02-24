using Application.Models.Exception;
using EmailValidation;

namespace Application.Models.ValueObjects;

public sealed record EMailAddress
{
    public string Email {get;}
 
    public EMailAddress(string email)
    {
        
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        
        email = email.Trim();
    
         if(!EmailValidator.Validate(
                email,
                false, //Domain muss mindestens einen Punkt enthalten
                false //Keine Umlaute und 
                )
            )
             throw new InvalidEmailException("Invalid email address");
         
        Email = email;
    }

    public override string ToString() => Email;
}