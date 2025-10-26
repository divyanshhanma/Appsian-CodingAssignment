using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MiniProjectManager.Api.Data;
using MiniProjectManager.Api.Helpers;
using MiniProjectManager.Api.Repositories;
using MiniProjectManager.Api.Services;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL; // Added for PostgreSQL
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var env = builder.Environment;
    string connectionString;

    if (env.IsDevelopment())
    {
        // For local development, get from appsettings (which can be SQLite)
        connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Development database connection string 'DefaultConnection' is not configured.");
        }
        options.UseSqlite(connectionString);
    }
    else
    {
        // For production, try to get from DATABASE_URL environment variable first (common for Render)
        connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            // Fallback to GetConnectionString("DefaultConnection") if DATABASE_URL is not set directly
            connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException("Production database connection string 'DATABASE_URL' or 'DefaultConnection' is not configured.");
            }
        }

        // Use NpgsqlConnectionStringBuilder to handle both URL-style and key-value pair connection strings
        // This is crucial for Render's postgresql:// format
        var npgsqlBuilder = new NpgsqlConnectionStringBuilder(connectionString);
        var formattedConnectionString = npgsqlBuilder.ConnectionString; // This will normalize the string
        options.UseNpgsql(formattedConnectionString);
    }
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<ISchedulerService, SchedulerService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not configured"))),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // React app's default Vite port
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication(); // Use authentication middleware
app.UseAuthorization();

app.UseCors(); // Enable CORS

app.MapControllers();

// Ensure migrations are applied on startup for production environments
// This is often handled by hosting platforms or CI/CD pipelines in production, 
// but for simplicity, we can do it here. 
// Be cautious with this in high-traffic production scenarios; prefer dedicated migration tools.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

app.Run();
