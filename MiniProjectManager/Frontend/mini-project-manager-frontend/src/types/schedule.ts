export interface TaskToSchedule {
  title: string;
  estimatedHours: number;
  dueDate?: string; // Optional due date, using string for simplicity in frontend input
  dependencies?: string[]; // Optional list of task titles
}

export interface ScheduleTaskRequest {
  tasks: TaskToSchedule[];
}

export interface ScheduledTaskDto {
  task: string;
  start: string;
  end: string;
}

export interface ScheduleResponse {
  schedule: ScheduledTaskDto[];
}

