using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniProjectManager.Api.DTOs.Schedule;
using MiniProjectManager.Api.Services;
using System.Security.Claims;

namespace MiniProjectManager.Api.Controllers
{
    [ApiController]
    [Route("api/v1/projects/{projectId}/[controller]")]
    [Authorize]
    public class SchedulingController : ControllerBase
    {
        private readonly ISchedulerService _schedulerService;
        private readonly IProjectService _projectService;

        public SchedulingController(ISchedulerService schedulerService, IProjectService projectService)
        {
            _schedulerService = schedulerService;
            _projectService = projectService;
        }

        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException("User not authenticated."));

        [HttpPost("schedule")]
        public async Task<ActionResult<ScheduleResponse>> ScheduleTasks(int projectId, ScheduleTaskRequest request)
        {
            var userId = GetUserId();
            var project = await _projectService.GetProjectByIdAsync(projectId, userId);
            if (project == null)
            {
                return NotFound("Project not found or not authorized.");
            }

            var schedule = await _schedulerService.GenerateScheduleAsync(request.Tasks);
            return Ok(schedule);
        }
    }
}

