using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using GiftMatch.Entity;


namespace GiftMatch.Migrations
{
    public class GiftMatchDbContextFactory : IDesignTimeDbContextFactory<GiftMatchDbContext>
    {
        public GiftMatchDbContext CreateDbContext(string[] args)
        {
            string connectionString = args[0];

            DbContextOptionsBuilder<GiftMatchDbContext> optionsBuilder = new DbContextOptionsBuilder<GiftMatchDbContext>();
            optionsBuilder.UseNpgsql(connectionString, npgsqlOptions => npgsqlOptions.MigrationsAssembly("GiftMatch.Migrations"));
            
            return new GiftMatchDbContext(optionsBuilder.Options);
        }
    }
}