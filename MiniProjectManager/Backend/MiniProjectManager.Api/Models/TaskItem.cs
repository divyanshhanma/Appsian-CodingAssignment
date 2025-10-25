using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Api.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; }

        [Range(0.1, 24.0)] // Assuming tasks can be scheduled for a minimum of 0.1 hours and maximum of 24 hours
        public double EstimatedHours { get; set; }

        public string? DependenciesJson { get; set; } // Storing dependencies as JSON string

        public int ProjectId { get; set; }
        public Project Project { get; set; } = default!;
    }
}


