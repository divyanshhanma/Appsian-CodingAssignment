using MiniProjectManager.Api.DTOs.Task;
using MiniProjectManager.Api.Models;
using MiniProjectManager.Api.Repositories;
using System.Text.Json; // Added for JSON serialization/deserialization

namespace MiniProjectManager.Api.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IProjectRepository _projectRepository;

        public TaskService(ITaskRepository taskRepository, IProjectRepository projectRepository)
        {
            _taskRepository = taskRepository;
            _projectRepository = projectRepository;
        }

        public async Task<IEnumerable<TaskDto>> GetTasksByProjectIdAsync(int projectId, int userId)
        {
            var project = await _projectRepository.GetByIdAsync(projectId);
            if (project == null || project.UserId != userId)
            {
                return Enumerable.Empty<TaskDto>();
            }

            var tasks = await _taskRepository.GetAllByProjectIdAsync(projectId);
            return tasks.Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                ProjectId = t.ProjectId,
                EstimatedHours = t.EstimatedHours,
                Dependencies = t.DependenciesJson != null ? JsonSerializer.Deserialize<List<string>>(t.DependenciesJson) ?? new List<string>() : new List<string>()
            });
        }

        public async Task<TaskDto?> GetTaskByIdAsync(int id, int userId)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null)
            {
                return null;
            }

            var project = await _projectRepository.GetByIdAsync(task.ProjectId);
            if (project == null || project.UserId != userId)
            {
                return null;
            }

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId,
                EstimatedHours = task.EstimatedHours,
                Dependencies = task.DependenciesJson != null ? JsonSerializer.Deserialize<List<string>>(task.DependenciesJson) ?? new List<string>() : new List<string>()
            };
        }

        public async Task<TaskDto> CreateTaskAsync(int projectId, CreateTaskDto createTaskDto, int userId)
        {
            var project = await _projectRepository.GetByIdAsync(projectId);
            if (project == null || project.UserId != userId)
            {
                throw new UnauthorizedAccessException("Project not found or not authorized.");
            }

            var task = new TaskItem
            {
                Title = createTaskDto.Title,
                DueDate = createTaskDto.DueDate,
                IsCompleted = false,
                ProjectId = projectId,
                EstimatedHours = createTaskDto.EstimatedHours,
                DependenciesJson = JsonSerializer.Serialize(createTaskDto.Dependencies)
            };

            await _taskRepository.AddAsync(task);

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId,
                EstimatedHours = task.EstimatedHours,
                Dependencies = createTaskDto.Dependencies
            };
        }

        public async Task<bool> UpdateTaskAsync(int id, UpdateTaskDto updateTaskDto, int userId)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null)
            {
                return false;
            }

            var project = await _projectRepository.GetByIdAsync(task.ProjectId);
            if (project == null || project.UserId != userId)
            {
                return false;
            }

            task.Title = updateTaskDto.Title;
            task.DueDate = updateTaskDto.DueDate;
            task.IsCompleted = updateTaskDto.IsCompleted;
            task.EstimatedHours = updateTaskDto.EstimatedHours;
            task.DependenciesJson = JsonSerializer.Serialize(updateTaskDto.Dependencies);

            await _taskRepository.UpdateAsync(task);
            return true;
        }

        public async Task<bool> DeleteTaskAsync(int id, int userId)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null)
            {
                return false;
            }

            var project = await _projectRepository.GetByIdAsync(task.ProjectId);
            if (project == null || project.UserId != userId)
            {
                return false;
            }

            await _taskRepository.DeleteAsync(id);
            return true;
        }
    }
}


