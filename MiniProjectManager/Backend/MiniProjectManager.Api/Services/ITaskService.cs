using MiniProjectManager.Api.DTOs.Task;

namespace MiniProjectManager.Api.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetTasksByProjectIdAsync(int projectId, int userId);
        Task<TaskDto?> GetTaskByIdAsync(int id, int userId);
        Task<TaskDto> CreateTaskAsync(int projectId, CreateTaskDto createTaskDto, int userId);
        Task<bool> UpdateTaskAsync(int id, UpdateTaskDto updateTaskDto, int userId);
        Task<bool> DeleteTaskAsync(int id, int userId);
    }
}


