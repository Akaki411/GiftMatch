using GiftMatch.Entity;
using GiftMatch.Migrations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using GiftMatch.api.Middleware;
using GiftMatch.api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;



namespace GiftMatch.api
{
    class Program
    {
        public static Task Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
    
            Connection connection = new Connection("settings.json");
            builder.Services.AddDbContext<GiftMatchDbContext>(options => options.UseNpgsql(connection.GetConnectionString()));
    
            builder.Services.AddMemoryCache();
    
            string secretKey = connection.GetSecretKey();
    
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = connection.GetIssuer(),
                    ValidAudience = connection.GetAudience(),
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                    ClockSkew = TimeSpan.Zero
                };
            });
    
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("ADMIN"));
                options.AddPolicy("ModerOrAdmin", policy => policy.RequireRole("MODER", "ADMIN"));
            });
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                    });
            });
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IProductService, ProductService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IWishlistService, WishlistService>();
            builder.Services.AddScoped<IFavoriteService, FavoriteService>();
            builder.Services.AddScoped<ICartService, CartService>();
            builder.Services.AddScoped<IOrderService, OrderService>();
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "GiftMatch API", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
    
            WebApplication app = builder.Build();
    
            string staticFilesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            string uploadsPath = Path.Combine(staticFilesPath, "uploads");
            string imagesPath = Path.Combine(uploadsPath, "images");
            string avatarsPath = Path.Combine(uploadsPath, "avatars");
        
            Directory.CreateDirectory(uploadsPath);
            Directory.CreateDirectory(imagesPath);
            Directory.CreateDirectory(avatarsPath);
            
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
            }
            
            app.UseStaticFiles();
        
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(uploadsPath),
                RequestPath = "/uploads",
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=604800");
                    ctx.Context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
                }
            });
    
            app.UseHttpsRedirection();
    
            app.UseCors("AllowFrontend");
            app.UseMiddleware<ExceptionHandlingMiddleware>();
    
            app.UseAuthentication(); 
            app.UseMiddleware<JwtMiddleware>();
    
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
            return Task.CompletedTask;
        }
    }
}
