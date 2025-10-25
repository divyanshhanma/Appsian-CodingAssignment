namespace MiniProjectManager.Api.DTOs.Schedule
{
    public class ScheduledTaskDto
    {
        public string Task { get; set; } = string.Empty;
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}

