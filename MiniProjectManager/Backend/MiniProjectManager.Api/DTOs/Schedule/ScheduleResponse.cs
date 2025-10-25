using System.Collections.Generic;

namespace MiniProjectManager.Api.DTOs.Schedule
{
    public class ScheduleResponse
    {
        public List<ScheduledTaskDto> Schedule { get; set; } = new List<ScheduledTaskDto>();
    }
}

