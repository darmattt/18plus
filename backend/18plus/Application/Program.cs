using Application.Infrastructure;
using Application.Models.Exception;
using Application.Models.Services;
using Application.Models.Users;
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
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        
        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new EmailConverter());
            options.JsonSerializerOptions.Converters.Add(new PhoneNumberConverter());
            options.JsonSerializerOptions.Converters.Add(new ClassNumberConverter());
        });

        builder.Services.AddControllers();
        builder.Services.AddProblemDetails();
        
        builder.Services.AddDbContext<EighteenplusDbContext>(options =>
            options.UseSqlite("DataSource=eighteenplus.db"));


        builder.Logging.AddConsole();

        builder.Services.AddSingleton<PasswordHasher<UserBase>>();
        builder.Services.AddSingleton<IOneTimeCodeService, OneTimeCodeService>();
        builder.Services.AddSingleton<IPasswordService, PasswordService>();
        builder.Services.Configure<PasswordHasherOptions>(options =>
        {
            options.IterationCount = 600_000;
        });
        builder.Services.AddTransient<IAdminService, AdminService>();
        builder.Services.AddScoped<EighteenplusDbContext>();
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
            var passwordHasher = scope.ServiceProvider.GetRequiredService<PasswordHasher<UserBase>>();
            var passwordService = scope.ServiceProvider.GetRequiredService<IPasswordService>();
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
            DatabaseSeeder.Seed(db, passwordHasher, passwordService);
        }


        // --- 3. Middleware Phase ---
        // WHY: Configure the Order of Middleware (e.g. routing, auth, error handling) and map endpoints before starting the server.
        app.UseExceptionHandler();
        // TODO: Enable later when auth is implemented
        // app.UseAuthentication();
        // app.UseAuthorization();
        // Exposes the OpenAPI spec at /openapi/v1.json
        //app.MapOpenApi();
        // Serves the Scalar UI at /scalar/v1 (interactive API docs)
        app.MapScalarApiReference();
        // Maps controller routes so incoming HTTP requests
        app.MapControllers();
        // Starts Kestrel
        app.Run();
    }
}