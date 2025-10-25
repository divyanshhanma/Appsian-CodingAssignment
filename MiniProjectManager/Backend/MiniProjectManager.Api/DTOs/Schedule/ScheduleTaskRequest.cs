using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Api.DTOs.Schedule
{
    public class ScheduleTaskRequest
    {
        [Required]
        [MinLength(1)]
        public List<TaskToSchedule> Tasks { get; set; } = new List<TaskToSchedule>();
    }
}

