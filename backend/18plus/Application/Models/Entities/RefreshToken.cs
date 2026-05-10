using Application.Models.Enitities;
using Application.Models.Users;

namespace Application.Models.Entities;

public class RefreshToken : EntityBase
{
    public int UserId { get; set; }

    public string TokenHash { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public bool IsRevoked { get; set; }

    public UserBase User { get; set; } = null!;
}