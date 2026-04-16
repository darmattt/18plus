namespace SpengerbiteApi.Exceptions;

public class ServiceApplicationException : Exception
{
    public int StatusCode { get; }

    private ServiceApplicationException(int statusCode, string message) : base(message)
    {
        StatusCode = statusCode;
    }

    public static ServiceApplicationException NotFound(string message) => 
        new(StatusCodes.Status404NotFound, message);

    public static ServiceApplicationException Forbidden(string message) => 
        new(StatusCodes.Status403Forbidden, message);

    public static ServiceApplicationException Conflict(string message) => 
        new(StatusCodes.Status409Conflict, message);

    public static ServiceApplicationException BadRequest(string message) => 
        new(StatusCodes.Status400BadRequest, message);
}