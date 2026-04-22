    using System.Security.Claims;
    using Application.Models.Services;

    public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
    {
        public Guid? UserId
        {
            get
            {
                var context = httpContextAccessor.HttpContext;
                if (context is null) return null;  // expliziter Guard

                var userId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                return Guid.TryParse(userId, out var id) ? id : null;
            }
        }
        public bool IsAuthenticated => UserId.HasValue;

    }