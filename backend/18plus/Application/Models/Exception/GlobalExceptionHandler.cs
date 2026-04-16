using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using SpengerbiteApi.Exceptions;
using SpengerbiteApi.Extensions;

namespace Application.Models.Exception;

public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, System.Exception exception, CancellationToken cancellationToken)
    {
        // Map: exception to HTTP status code + client safe message
        var (statusCode, detail) = exception switch
        {
            ServiceApplicationException ex => 
                (ex.StatusCode, ex.Message),
    
            DomainBusinessValidationException ex => 
                (400, ex.Message),

            ArgumentException ex => 
                (400, ex.Message),

            DbUpdateException ex when ex.IsUniqueConstraintViolation() => 
                (409, "A conflicting record already exists."),

            DbUpdateException 
                => (500, "A database error occurred."),

            _ => (500, "An unexpected error occurred.")
        };

        // Log: warnings for client errors (4xx), errors for server errors (5xx)
        var logLevel = statusCode >= 500 ? LogLevel.Error : LogLevel.Warning;

        logger.Log(logLevel, exception, "{StatusCode} {Path}", statusCode, httpContext.Request.Path);

        // Return: RFC 9457 ProblemDetails JSON
        httpContext.Response.StatusCode = statusCode;
        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = ReasonPhrases.GetReasonPhrase(statusCode),
            Detail = detail
        };
        await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);

        return true; // true= exception was handled
    }
}