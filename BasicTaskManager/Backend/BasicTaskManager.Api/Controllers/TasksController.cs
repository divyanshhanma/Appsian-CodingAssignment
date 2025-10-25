using Microsoft.AspNetCore.Mvc;
using BasicTaskManager.Api.Models;

namespace BasicTaskManager.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TasksController : ControllerBase
    {
        private static List<TaskItem> _tasks = new List<TaskItem>
        {
            new TaskItem { Id = 1, Description = "Learn C# .NET 8", IsCompleted = false },
            new TaskItem { Id = 2, Description = "Build React Frontend", IsCompleted = false },
            new TaskItem { Id = 3, Description = "Integrate APIs", IsCompleted = false }
        };
        private static int _nextId = 4;

        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> Get()
        {
            return Ok(_tasks);
        }

        [HttpPost]
        public ActionResult<TaskItem> Post(TaskItem task)
        {
            task.Id = _nextId++;
            _tasks.Add(task);
            return CreatedAtAction(nameof(Get), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public ActionResult Put(int id, TaskItem updatedTask)
        {
            var existingTask = _tasks.FirstOrDefault(t => t.Id == id);
            if (existingTask == null)
            {
                return NotFound();
            }

            existingTask.Description = updatedTask.Description;
            existingTask.IsCompleted = updatedTask.IsCompleted;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var taskToRemove = _tasks.FirstOrDefault(t => t.Id == id);
            if (taskToRemove == null)
            {
                return NotFound();
            }

            _tasks.Remove(taskToRemove);
            return NoContent();
        }
    }
}
