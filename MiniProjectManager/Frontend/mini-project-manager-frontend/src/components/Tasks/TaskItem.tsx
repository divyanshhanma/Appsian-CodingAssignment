import React from 'react';
import { Task } from '../../types/task';
import './Tasks.css'; // Import the CSS file

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: number, isCompleted: boolean) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggleComplete(task.id, !task.isCompleted)}
      />
      <span style={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
        <strong>{task.title}</strong>
        {task.dueDate && ` (Due: ${new Date(task.dueDate).toLocaleDateString()})`}
        {task.estimatedHours > 0 && ` (${task.estimatedHours}h)`}
        {task.dependencies && task.dependencies.length > 0 && ` [Depends on: ${task.dependencies.join(', ')}]`}
      </span>
      <div className="task-actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button className="delete-button" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
};

export default TaskItem;


