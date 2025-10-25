import React, { useState } from 'react';
import { TaskToSchedule, ScheduleResponse, ScheduledTaskDto, ScheduleTaskRequest } from '../../types/schedule';
import { generateSchedule } from '../../services/scheduleService';

interface ScheduleFormProps {
  projectId: number;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<TaskToSchedule[]>([{ title: '', estimatedHours: 0, dueDate: '', dependencies: [] }]);
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddTask = () => {
    setTasks([...tasks, { title: '', estimatedHours: 0, dueDate: '', dependencies: [] }]);
  };

  const handleRemoveTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleTaskChange = (index: number, field: keyof TaskToSchedule, value: string | number) => {
    const newTasks = [...tasks];
    if (field === 'estimatedHours') {
      newTasks[index].estimatedHours = parseFloat(value as string) || 0;
    } else if (field === 'dependencies') {
      newTasks[index].dependencies = (value as string).split(',').map(dep => dep.trim()).filter(dep => dep !== '');
    } else {
      newTasks[index][field] = value as any; // Handles title and dueDate
    }
    setTasks(newTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const validTasks = tasks.filter(task => task.title.trim() !== '' && task.estimatedHours > 0);
    if (validTasks.length === 0) {
      setError('Please add at least one valid task with a title and estimated hours.');
      setIsLoading(false);
      return;
    }

    try {
      const requestTasks: TaskToSchedule[] = validTasks.map(task => ({
        title: task.title,
        estimatedHours: task.estimatedHours,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined, // Convert to ISO string for backend
        dependencies: task.dependencies && task.dependencies.length > 0 ? task.dependencies : undefined,
      }));

      const request: ScheduleTaskRequest = { tasks: requestTasks };
      const response = await generateSchedule(projectId, request);
      setSchedule(response);
    } catch (err: any) {
      // Check if the error is a circular dependency
      const errorMessage = err.response?.data?.message || err.message || 'Failed to generate schedule.';
      if (errorMessage.includes("Circular dependency detected")) {
        setError("Scheduling failed: Circular dependency detected in your tasks. Please check your dependencies.");
      } else if (errorMessage.includes("Dependency") && errorMessage.includes("not found")) {
        setError(`Scheduling failed: A dependency was specified for a task that does not exist in the list of tasks to be scheduled. Error: ${errorMessage}`);
      } else {
        setError(errorMessage);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="schedule-form-container">
      <h3>Generate Smart Schedule</h3>
      <form onSubmit={handleSubmit}>
        {tasks.map((task, index) => (
          <div key={index} className="task-input-row">
            <input
              type="text"
              placeholder="Task Title"
              value={task.title}
              onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Estimated Hours"
              value={task.estimatedHours}
              onChange={(e) => handleTaskChange(index, 'estimatedHours', e.target.value)}
              min="0.1"
              step="0.1"
              required
            />
            <input
              type="date"
              placeholder="Due Date (optional)"
              value={task.dueDate || ''}
              onChange={(e) => handleTaskChange(index, 'dueDate', e.target.value)}
            />
            <input
              type="text"
              placeholder="Dependencies (comma-separated titles)"
              value={task.dependencies?.join(', ') || ''}
              onChange={(e) => handleTaskChange(index, 'dependencies', e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveTask(index)}>-</button>
          </div>
        ))}
        <button type="button" onClick={handleAddTask}>Add Another Task</button>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Schedule'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {schedule && schedule.schedule.length > 0 && (
        <div className="generated-schedule">
          <h4>Generated Schedule:</h4>
          <ul>
            {schedule.schedule.map((st, index) => (
              <li key={index}>
                <strong>{st.task}</strong>: {new Date(st.start).toLocaleString()} - {new Date(st.end).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduleForm;

