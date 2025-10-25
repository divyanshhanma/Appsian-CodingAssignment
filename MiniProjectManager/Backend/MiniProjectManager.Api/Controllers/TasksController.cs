using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniProjectManager.Api.DTOs.Task;
using MiniProjectManager.Api.Services;
using System.Security.Claims;

namespace MiniProjectManager.Api.Controllers
{
    [ApiController]
    [Route("api/projects/{projectId}/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException("User not authenticated."));

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks(int projectId)
        {
            var userId = GetUserId();
            var tasks = await _taskService.GetTasksByProjectIdAsync(projectId, userId);
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int projectId, int id)
        {
            var userId = GetUserId();
            var task = await _taskService.GetTaskByIdAsync(id, userId);
            if (task == null || task.ProjectId != projectId)
            {
                return NotFound();
            }
            return Ok(task);
        }

        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask(int projectId, CreateTaskDto createTaskDto)
        {
            try
            {
                var userId = GetUserId();
                var task = await _taskService.CreateTaskAsync(projectId, createTaskDto, userId);
                return CreatedAtAction(nameof(GetTask), new { projectId = projectId, id = task.Id }, task);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTask(int projectId, int id, UpdateTaskDto updateTaskDto)
        {
            var userId = GetUserId();
            var result = await _taskService.UpdateTaskAsync(id, updateTaskDto, userId);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(int projectId, int id)
        {
            var userId = GetUserId();
            var result = await _taskService.DeleteTaskAsync(id, userId);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}


