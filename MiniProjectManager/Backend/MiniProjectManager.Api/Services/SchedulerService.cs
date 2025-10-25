using MiniProjectManager.Api.DTOs.Schedule;

namespace MiniProjectManager.Api.Services
{
    public class SchedulerService : ISchedulerService
    {
        private const int WorkDayStartHour = 9; // 9 AM
        private const int WorkDayEndHour = 17;  // 5 PM
        private const int LunchBreakStartHour = 12; // 12 PM
        private const int LunchBreakEndHour = 13;   // 1 PM

        public Task<ScheduleResponse> GenerateScheduleAsync(List<TaskToSchedule> tasks)
        {
            var scheduleResponse = new ScheduleResponse();
            var currentScheduleTime = GetNextAvailableWorkTime(DateTime.UtcNow);

            // 1. Topological Sort (Dependency Resolution)
            var sortedTasks = TopologicalSort(tasks);
            if (sortedTasks == null) // Circular dependency detected
            {
                throw new InvalidOperationException("Circular dependency detected in tasks.");
            }

            foreach (var taskToSchedule in sortedTasks)
            {
                var remainingHours = taskToSchedule.EstimatedHours;
                var taskSchedule = new List<ScheduledTaskDto>(); // To hold parts of a task if split

                // Set a start boundary if the task has dependencies, effectively making it start after previous tasks
                // For simplicity, we assume currentScheduleTime inherently respects the topological sort
                
                while (remainingHours > 0)
                {
                    currentScheduleTime = GetNextAvailableWorkTime(currentScheduleTime);

                    var availableHoursInCurrentBlock = GetAvailableHoursInCurrentWorkBlock(currentScheduleTime);

                    double hoursToSchedule = Math.Min(remainingHours, availableHoursInCurrentBlock);

                    var taskStart = currentScheduleTime;
                    var taskEnd = taskStart.AddHours(hoursToSchedule);

                    taskSchedule.Add(new ScheduledTaskDto
                    {
                        Task = taskToSchedule.Title,
                        Start = taskStart,
                        End = taskEnd
                    });

                    currentScheduleTime = taskEnd; // Move current time forward
                    remainingHours -= hoursToSchedule;
                }

                // After scheduling a task, check against its DueDate
                if (taskToSchedule.DueDate.HasValue && currentScheduleTime.Date > taskToSchedule.DueDate.Value.Date)
                {
                    // This is a simple flag. In a real application, you might add a property to ScheduledTaskDto
                    // or the ScheduleResponse to indicate a missed due date.
                    Console.WriteLine($"Warning: Task '{taskToSchedule.Title}' might miss its due date ({taskToSchedule.DueDate.Value.ToShortDateString()}). Scheduled until {currentScheduleTime.ToShortDateString()}");
                }
                scheduleResponse.Schedule.AddRange(taskSchedule);
            }

            return Task.FromResult(scheduleResponse);
        }

        private List<TaskToSchedule>? TopologicalSort(List<TaskToSchedule> tasks)
        {
            var graph = new Dictionary<string, List<string>>();
            var inDegree = new Dictionary<string, int>();
            var taskMap = tasks.ToDictionary(t => t.Title, t => t);

            foreach (var task in tasks)
            {
                graph[task.Title] = new List<string>();
                inDegree[task.Title] = 0;
            }

            foreach (var task in tasks)
            {
                foreach (var dependency in task.Dependencies)
                {
                    if (!taskMap.ContainsKey(dependency))
                    {
                        throw new ArgumentException($"Dependency '{dependency}' for task '{task.Title}' not found.");
                    }
                    graph[dependency].Add(task.Title);
                    inDegree[task.Title]++;
                }
            }

            var queue = new Queue<string>();
            foreach (var entry in inDegree)
            {
                if (entry.Value == 0)
                {
                    queue.Enqueue(entry.Key);
                }
            }

            var sortedList = new List<TaskToSchedule>();
            while (queue.Any())
            {
                var taskTitle = queue.Dequeue();
                sortedList.Add(taskMap[taskTitle]);

                foreach (var neighbor in graph[taskTitle])
                {
                    inDegree[neighbor]--;
                    if (inDegree[neighbor] == 0)
                    {
                        queue.Enqueue(neighbor);
                    }
                }
            }

            if (sortedList.Count != tasks.Count)
            {
                return null; // Circular dependency detected
            }

            return sortedList;
        }

        private DateTime GetNextAvailableWorkTime(DateTime currentTime)
        {
            // Move to the next work day if it's a weekend
            while (currentTime.DayOfWeek == DayOfWeek.Saturday || currentTime.DayOfWeek == DayOfWeek.Sunday)
            {
                currentTime = currentTime.AddDays(1).Date.AddHours(WorkDayStartHour);
            }

            // If current time is after work day ends, move to next day's start
            if (currentTime.Hour >= WorkDayEndHour)
            {
                currentTime = currentTime.AddDays(1).Date.AddHours(WorkDayStartHour);
                // Check for weekend again if we moved to next day
                return GetNextAvailableWorkTime(currentTime);
            }

            // If current time is before work day starts, set to work day start
            if (currentTime.Hour < WorkDayStartHour)
            {
                currentTime = currentTime.Date.AddHours(WorkDayStartHour);
            }

            // If current time is within lunch break, move past lunch break
            if (currentTime.Hour >= LunchBreakStartHour && currentTime.Hour < LunchBreakEndHour)
            {
                currentTime = currentTime.Date.AddHours(LunchBreakEndHour);
            }

            return currentTime;
        }

        private double GetAvailableHoursInCurrentWorkBlock(DateTime currentTime)
        {
            var endOfWorkDay = currentTime.Date.AddHours(WorkDayEndHour);
            var endOfLunchBreak = currentTime.Date.AddHours(LunchBreakEndHour);

            if (currentTime.Hour >= LunchBreakStartHour && currentTime.Hour < LunchBreakEndHour)
            {
                // If currently in lunch break, remaining available hours are from after lunch to end of day
                return (endOfWorkDay - endOfLunchBreak).TotalHours;
            }
            else if (currentTime.Hour < LunchBreakStartHour)
            {
                // If before lunch, calculate until lunch break or end of day if no lunch break within the current block
                return (endOfWorkDay - currentTime).TotalHours - Math.Max(0, (endOfLunchBreak - currentTime).TotalHours);
            }
            else
            {
                // If after lunch, calculate until end of day
                return (endOfWorkDay - currentTime).TotalHours;
            }
        }
    }
}

