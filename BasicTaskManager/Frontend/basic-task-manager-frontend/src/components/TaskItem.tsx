import React from 'react';
import { Task } from '../types/task';
import './TaskItem.css'; // Import the CSS file

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number, isCompleted: boolean) => void;
  onDeleteTask: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDeleteTask }) => {
  return (
    <div className={`task-item ${task.isCompleted ? 'completed' : ''}`}> {/* Apply class based on completion status */}
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggleComplete(task.id, !task.isCompleted)}
      />
      <span>
        <strong>{task.description}</strong>
      </span>
      <div className="actions">
        <button className="delete-button" onClick={() => onDeleteTask(task.id)}>Delete</button>
      </div>
    </div>
  );
};

export default TaskItem;
