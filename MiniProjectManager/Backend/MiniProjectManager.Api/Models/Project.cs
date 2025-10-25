using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace MiniProjectManager.Api.Models
{
    public class Project
    {
        public int Id { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime CreationDate { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = default!;

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}


