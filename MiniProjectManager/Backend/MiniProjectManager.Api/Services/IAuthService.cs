using MiniProjectManager.Api.DTOs.Auth;

namespace MiniProjectManager.Api.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> RegisterAsync(RegisterRequest request);
        Task<AuthResponse?> LoginAsync(LoginRequest request);
    }
}


