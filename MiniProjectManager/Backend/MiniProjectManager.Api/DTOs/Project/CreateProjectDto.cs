using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Api.DTOs.Project
{
    public class CreateProjectDto
    {
        [Required]
        [MinLength(3)]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }
    }
}


