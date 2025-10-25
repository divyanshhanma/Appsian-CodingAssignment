import React from 'react';
import { Task } from '../../types/task';
import TaskItem from './TaskItem';
import './Tasks.css'; // Import the CSS file

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: number, isCompleted: boolean) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onDeleteTask, onEditTask }) => {
  return (
    <div className="task-list-container">
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;


