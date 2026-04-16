namespace Application.Models.Exception;

public class DomainBuisnessValidationException(string? message) : System.Exception(message);