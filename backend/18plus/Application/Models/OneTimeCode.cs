namespace Application.Models;

public class OneTimeCode
{
    public string Code { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool isUsed  { get; set; }
    public Student Student { get; set; }
}