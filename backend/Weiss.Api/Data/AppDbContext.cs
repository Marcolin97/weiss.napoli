using Microsoft.EntityFrameworkCore;
using Weiss.Api.Models;

namespace Weiss.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Season> Seasons => Set<Season>();
}

