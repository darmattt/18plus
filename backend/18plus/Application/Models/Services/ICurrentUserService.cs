namespace Application.Models.Services;

public interface ICurrentUserService
{
    Guid? UserId { get; }
}