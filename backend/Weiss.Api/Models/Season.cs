namespace Weiss.Api.Models;

public class Season
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int Year { get; set; }
    public int StagesCount { get; set; }
    public bool IsActive { get; set; }
}
