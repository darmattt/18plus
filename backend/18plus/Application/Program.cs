using Application.Infrastructure;
using Application.Models.Services;
using Application.ViewModels.Converters;
using Microsoft.AspNetCore.Identity;

namespace Application;

using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

// --- 1. Builder Phase ---
// WHY: Register Services and configure the WebApplicationBuilder (DI, logging, config, Kestrel, etc.)
public class Program
{
    public static void Main(string[] args)
    {
// Creates a WebApplicationBuilder with default config (appsettings.json, env variables, logging, Kestrel)
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers().AddJsonOptions(options =>
            options.JsonSerializerOptions.Converters.Add(new EmailConverter())
        );

// Registers controller services (incl. model binding, routing)
        builder.Services.AddControllers();

// Registers EighteenplusContext
        builder.Services.AddDbContext<EighteenplusDbContext>(options =>
            options.UseSqlite("DataSource=eighteenplus.db"));
        
        builder.Logging.AddConsole();

        builder.Services.AddTransient<IPasswordHasher<object>, PasswordHasher<object>>();
        builder.Services.AddTransient<PasswordHasherService>();
// Registers OpenAPI
        //builder.Services.AddOpenApi();

// Builds the WebApplication
        var app = builder.Build();


// --- 2. Initialization Phase ---
// WHY: Perform app initialization tasks (e.g. database setup) before handling requests.

// Creates the database if it doesn't exist
        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<EighteenplusDbContext>();
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
        }
        


// --- 3. Middleware Phase ---
// WHY: Configure the Order of Middleware (e.g. routing, auth, error handling) and map endpoints before starting the server.

// TODO: Enable later when auth is implemented
// app.UseAuthentication();
// app.UseAuthorization();
// Exposes the OpenAPI spec at /openapi/v1.json
      //  app.MapOpenApi();
// Serves the Scalar UI at /scalar/v1 (interactive API docs)
        app.MapScalarApiReference();
// Maps controller routes so incoming HTTP requests
        app.MapControllers();
// Starts Kestrel
        app.Run();
    }
}