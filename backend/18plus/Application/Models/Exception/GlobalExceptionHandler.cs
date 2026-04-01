using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
namespace Application.Models.Exception;

public class GlobalExceptionHandler : IExceptionHandler
{

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        System.Exception exception,
        CancellationToken cancellationToken
    )
    {
        var statusCode = exception switch
        {
            KeyNotFoundException => StatusCodes.Status404NotFound,
            EighteenplusException => StatusCodes.Status400BadRequest,
            InvalidEmailException => StatusCodes.Status400BadRequest,
            ArgumentException => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };
        
        // Return RFC 9457 Problem Details response
        var problem = new ProblemDetails()
        {
            Detail = exception.Message,
            Status = StatusCodes.Status400BadRequest,

        };
            
        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

        await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);

        return true;
        
    }
    private static string GetTitle(int statusCode) => statusCode switch
    {
        StatusCodes.Status400BadRequest => "Bad Request",
        StatusCodes.Status404NotFound => "Not Found",
        StatusCodes.Status500InternalServerError => "Internal Server Error",
        _ => "Error"
    };
}