namespace MiniProjectManager.Api.DTOs.Task
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public int ProjectId { get; set; }
        public double EstimatedHours { get; set; }
        public List<string> Dependencies { get; set; } = new List<string>();
    }
}


