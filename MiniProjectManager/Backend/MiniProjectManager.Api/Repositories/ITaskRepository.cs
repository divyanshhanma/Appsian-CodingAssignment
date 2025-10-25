using MiniProjectManager.Api.Models;

namespace MiniProjectManager.Api.Repositories
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskItem>> GetAllByProjectIdAsync(int projectId);
        Task<TaskItem?> GetByIdAsync(int id);
        Task AddAsync(TaskItem task);
        Task UpdateAsync(TaskItem task);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}


