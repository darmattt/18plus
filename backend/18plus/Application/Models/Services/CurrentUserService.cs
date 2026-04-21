using System.Security.Claims;
using Application.Models.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public int? UserId
    {
        get
        {
            var userId = httpContextAccessor.HttpContext?.User?
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userId, out var id))
                return id;

            return null;
        }
    }
}