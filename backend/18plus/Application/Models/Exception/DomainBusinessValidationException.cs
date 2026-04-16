using System.Runtime.Serialization;

namespace Application.Models.Exception;

public class DomainBusinessValidationException : System.Exception
{ 
    public DomainBusinessValidationException(string? message) : base(message)
    {
    }
    
}