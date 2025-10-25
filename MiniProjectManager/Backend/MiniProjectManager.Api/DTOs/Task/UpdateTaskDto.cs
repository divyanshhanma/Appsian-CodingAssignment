using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Api.DTOs.Task
{
    public class UpdateTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; }

        [Required]
        [Range(0.1, 24.0)]
        public double EstimatedHours { get; set; }

        public List<string> Dependencies { get; set; } = new List<string>();
    }
}


