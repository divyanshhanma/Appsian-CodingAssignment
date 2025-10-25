import React, { useState, useEffect } from 'react';
import { CreateTaskDto, UpdateTaskDto } from '../../types/task';

interface TaskFormProps {
  onSubmit: (task: CreateTaskDto | UpdateTaskDto) => void;
  initialData?: UpdateTaskDto;
  isEditMode?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, isEditMode = false }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
  const [isCompleted, setIsCompleted] = useState(initialData?.isCompleted || false);
  const [estimatedHours, setEstimatedHours] = useState(initialData?.estimatedHours || 0);
  const [dependencies, setDependencies] = useState(initialData?.dependencies?.join(', ') || '');
  const [errors, setErrors] = useState<{ title?: string; estimatedHours?: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
      setIsCompleted(initialData.isCompleted || false);
      setEstimatedHours(initialData.estimatedHours || 0);
      setDependencies(initialData.dependencies?.join(', ') || '');
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { title?: string; estimatedHours?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (estimatedHours <= 0) {
      newErrors.estimatedHours = 'Estimated hours must be greater than 0.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const taskDependencies = dependencies.split(',').map(dep => dep.trim()).filter(dep => dep !== '');
      onSubmit({
        title,
        dueDate: dueDate || undefined,
        estimatedHours,
        dependencies: taskDependencies,
        ...(isEditMode && { isCompleted }),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {errors.title && <p className="error">{errors.title}</p>}
      </div>
      <div>
        <label>Due Date (optional):</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div>
        <label>Estimated Hours:</label>
        <input
          type="number"
          value={estimatedHours}
          onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 0)}
          min="0.1"
          step="0.1"
          required
        />
        {errors.estimatedHours && <p className="error">{errors.estimatedHours}</p>}
      </div>
      <div>
        <label>Dependencies (comma-separated titles):</label>
        <input
          type="text"
          value={dependencies}
          onChange={(e) => setDependencies(e.target.value)}
          placeholder="e.g., Task A, Task B"
        />
      </div>
      {isEditMode && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
            />
            Completed
          </label>
        </div>
      )}
      <button type="submit">{isEditMode ? 'Update Task' : 'Create Task'}</button>
    </form>
  );
};

export default TaskForm;


