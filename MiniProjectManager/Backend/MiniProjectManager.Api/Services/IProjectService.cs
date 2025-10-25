using MiniProjectManager.Api.DTOs.Project;

namespace MiniProjectManager.Api.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectDto>> GetAllProjectsAsync(int userId);
        Task<ProjectDto?> GetProjectByIdAsync(int id, int userId);
        Task<ProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto, int userId);
        Task<bool> UpdateProjectAsync(int id, UpdateProjectDto updateProjectDto, int userId);
        Task<bool> DeleteProjectAsync(int id, int userId);
    }
}


