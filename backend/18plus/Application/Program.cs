using System.Text;
using Application.Infrastructure;
using Application.Models.Exception;
using Application.Models.Services;
using Application.Models.Users;
using Application.ViewModels.Converters;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

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
        builder.Configuration.AddUserSecrets<Program>(optional: true);
        
        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        
        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new EmailConverter());
            options.JsonSerializerOptions.Converters.Add(new PhoneNumberConverter());
            options.JsonSerializerOptions.Converters.Add(new ClassNumberConverter());
        });
        
        builder.Services.AddProblemDetails();
        
        
        builder.Services.AddDbContext<EighteenplusDbContext>(options =>
            options.UseSqlite("DataSource=eighteenplus.db"));


        builder.Logging.AddConsole();

        builder.Services.Configure<PasswordHasherOptions>(options =>
        {
            options.IterationCount = 600_000;
        });
        builder.Services.AddSingleton<PasswordHasher<UserBase>>();
        builder.Services.AddSingleton<IOneTimeCodeService, OneTimeCodeService>();
        builder.Services.AddSingleton<IPasswordService, PasswordService>();
        builder.Services.AddSingleton<ITokenService, TokenService>();
        builder.Services.AddHttpContextAccessor();
        builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
        builder.Services.AddTransient<IAdminService, AdminService>();
        builder.Services.AddScoped<ITeacherService, TeacherService>();
        builder.Services.AddScoped<IStudentService, StudentService>();

        // Registers OpenAPI
        //builder.Services.AddOpenApi();

        // Builds the WebApplication
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("FrontendPolicy", policy =>
            {
                policy
                    .WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        
        var jwtKey = builder.Configuration["Jwt:Key"]
                     ?? throw new InvalidOperationException("Jwt:Key is missing. For local development, set it with: dotnet user-secrets set \"Jwt:Key\" \"<secret>\"");
        var jwtIssuer = builder.Configuration["Jwt:Issuer"]
                        ?? throw new InvalidOperationException("Jwt:Issuer is missing.");
        var jwtAudience = builder.Configuration["Jwt:Audience"]
                          ?? throw new InvalidOperationException("Jwt:Audience is missing.");
        
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey
                        (Encoding.UTF8.GetBytes(jwtKey)),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true
                    
                };
            });
        
        builder.Services.AddAuthorization();

        
        var app = builder.Build();

// Middleware
        app.UseExceptionHandler();
        app.UseHttpsRedirection();
        app.UseCors("FrontendPolicy");
        app.UseAuthentication();
        app.UseAuthorization();

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
