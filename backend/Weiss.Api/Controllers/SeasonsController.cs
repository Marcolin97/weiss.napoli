using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Weiss.Api.Data;

namespace Weiss.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeasonsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SeasonsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var seasons = await _db.Seasons
            .OrderByDescending(s => s.Year)
            .ToListAsync();

        return Ok(seasons);
    }
}
