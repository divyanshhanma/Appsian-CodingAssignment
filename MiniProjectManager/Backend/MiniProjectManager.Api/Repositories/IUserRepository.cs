using MiniProjectManager.Api.Models;

namespace MiniProjectManager.Api.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task AddAsync(User user);
    }
}


