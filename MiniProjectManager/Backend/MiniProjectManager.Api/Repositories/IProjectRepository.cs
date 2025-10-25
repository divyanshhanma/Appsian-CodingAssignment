using MiniProjectManager.Api.Models;

namespace MiniProjectManager.Api.Repositories
{
    public interface IProjectRepository
    {
        Task<IEnumerable<Project>> GetAllByUserIdAsync(int userId);
        Task<Project?> GetByIdAsync(int id);
        Task AddAsync(Project project);
        Task UpdateAsync(Project project);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}


