using MiniProjectManager.Api.DTOs.Project;
using MiniProjectManager.Api.Models;
using MiniProjectManager.Api.Repositories;

namespace MiniProjectManager.Api.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;

        public ProjectService(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<IEnumerable<ProjectDto>> GetAllProjectsAsync(int userId)
        {
            var projects = await _projectRepository.GetAllByUserIdAsync(userId);
            return projects.Select(p => new ProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                CreationDate = p.CreationDate,
                UserId = p.UserId
            });
        }

        public async Task<ProjectDto?> GetProjectByIdAsync(int id, int userId)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project == null || project.UserId != userId)
            {
                return null;
            }
            return new ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreationDate = project.CreationDate,
                UserId = project.UserId
            };
        }

        public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto createProjectDto, int userId)
        {
            var project = new Project
            {
                Title = createProjectDto.Title,
                Description = createProjectDto.Description,
                CreationDate = DateTime.UtcNow,
                UserId = userId
            };
            await _projectRepository.AddAsync(project);
            return new ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreationDate = project.CreationDate,
                UserId = project.UserId
            };
        }

        public async Task<bool> UpdateProjectAsync(int id, UpdateProjectDto updateProjectDto, int userId)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project == null || project.UserId != userId)
            {
                return false;
            }

            project.Title = updateProjectDto.Title;
            project.Description = updateProjectDto.Description;

            await _projectRepository.UpdateAsync(project);
            return true;
        }

        public async Task<bool> DeleteProjectAsync(int id, int userId)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project == null || project.UserId != userId)
            {
                return false;
            }
            await _projectRepository.DeleteAsync(id);
            return true;
        }
    }
}


