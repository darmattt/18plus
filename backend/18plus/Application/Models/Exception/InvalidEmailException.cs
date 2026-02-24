namespace Application.Models.Exception;

public class InvalidEmailException : System.Exception
{
    public InvalidEmailException(string? message) : base(message)
    {
    }
}