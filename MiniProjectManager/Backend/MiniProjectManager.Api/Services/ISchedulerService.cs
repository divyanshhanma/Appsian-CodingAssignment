using MiniProjectManager.Api.DTOs.Schedule;

namespace MiniProjectManager.Api.Services
{
    public interface ISchedulerService
    {
        Task<ScheduleResponse> GenerateScheduleAsync(List<TaskToSchedule> tasks);
    }
}

