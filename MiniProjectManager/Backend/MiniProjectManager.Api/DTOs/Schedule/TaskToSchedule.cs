using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Api.DTOs.Schedule
{
    public class TaskToSchedule
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Range(0.1, 24.0)] // Assuming tasks can be scheduled for a minimum of 0.1 hours and maximum of 24 hours
        public double EstimatedHours { get; set; }

        public DateTime? DueDate { get; set; } // Optional due date
        public List<string> Dependencies { get; set; } = new List<string>(); // List of task titles that must be completed first
    }
}

