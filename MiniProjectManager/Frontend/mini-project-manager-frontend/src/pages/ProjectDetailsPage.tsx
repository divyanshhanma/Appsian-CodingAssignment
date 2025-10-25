import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Project } from '../types/project';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/task';
import { getProjectById } from '../services/projectService';
import { getTasksByProjectId, createTask, updateTask, deleteTask } from '../services/taskService';
import TaskForm from '../components/Tasks/TaskForm';
import { generateSchedule } from '../services/scheduleService';
import { ScheduleResponse, TaskToSchedule } from '../types/schedule';
import '../components/Tasks/Tasks.css'; // Import Tasks.css
import '../components/Schedule/Schedule.css'; // Import Schedule.css

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [generatedSchedule, setGeneratedSchedule] = useState<ScheduleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState<boolean>(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectAndTasks(projectId);
    }
  }, [projectId]);

  const fetchProjectAndTasks = async (id: string) => {
    try {
      const fetchedProject = await getProjectById(id);
      setProject(fetchedProject);

      const fetchedTasks = await getTasksByProjectId(id);
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to fetch project details or tasks.');
      console.error(err);
    }
  };

  const handleCreateOrUpdateTask = async (taskData: CreateTaskDto | UpdateTaskDto) => {
    setError(null);
    try {
      if (projectId) {
        if (editingTask) {
          const updatedTask = await updateTask(
            projectId,
            editingTask.id.toString(),
            taskData as UpdateTaskDto
          );
          setTasks((prev) =>
            prev.map((task) =>
              task.id === editingTask.id ? { ...task, ...taskData } as Task : task
            )
          );
        } else {
          const createdTask = await createTask(projectId, taskData as CreateTaskDto);
          setTasks((prev) => [...prev, createdTask]);
        }
        setShowTaskForm(false);
        setEditingTask(null);
        setGeneratedSchedule(null);
      }
    } catch (err) {
      setError(`Failed to ${editingTask ? 'update' : 'create'} task.`);
      console.error(err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
    setGeneratedSchedule(null);
  };

  const handleToggleTaskComplete = async (taskId: number, isCompleted: boolean) => {
    try {
      if (projectId) {
        const taskToUpdate = tasks.find(t => t.id === taskId);
        if (taskToUpdate) {
          const updatedTaskData: UpdateTaskDto = {
            title: taskToUpdate.title,
            dueDate: taskToUpdate.dueDate,
            isCompleted: isCompleted,
            estimatedHours: taskToUpdate.estimatedHours,
            dependencies: taskToUpdate.dependencies,
          };
          await updateTask(projectId, taskId.toString(), updatedTaskData);
          setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? { ...task, isCompleted: isCompleted } : task))
          );
          setGeneratedSchedule(null);
        }
      }
    } catch (err) {
      setError('Failed to update task status.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      if (projectId) {
        await deleteTask(projectId, taskId.toString());
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        setGeneratedSchedule(null);
      }
    } catch (err) {
      setError('Failed to delete task.');
      console.error(err);
    }
  };

  const handleGenerateSchedule = async () => {
    if (!projectId) return;
    setError(null);
    setIsScheduling(true);
    setGeneratedSchedule(null);

    const tasksToSchedule: TaskToSchedule[] = tasks.map(task => ({
      title: task.title,
      estimatedHours: task.estimatedHours,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
      dependencies: task.dependencies && task.dependencies.length > 0 ? task.dependencies : undefined,
    }));

    if (tasksToSchedule.length === 0) {
      setError('No tasks available to schedule. Please add tasks to the project first.');
      setIsScheduling(false);
      return;
    }

    try {
      const response = await generateSchedule(parseInt(projectId), { tasks: tasksToSchedule });
      setGeneratedSchedule(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to generate schedule.';
      if (errorMessage.includes("Circular dependency detected")) {
        setError("Scheduling failed: Circular dependency detected in your tasks. Please check your dependencies.");
      } else if (errorMessage.includes("Dependency") && errorMessage.includes("not found")) {
        setError(`Scheduling failed: A dependency was specified for a task that does not exist in the list of tasks to be scheduled. Error: ${errorMessage}`);
      } else {
        setError(errorMessage);
      }
    }
    setIsScheduling(false);
  };

  if (!project) {
    return <div>Loading project...</div>;
  }

  return (
    <div className="task-list-container"> {/* Using task-list-container for overall project details page */} 
      <h2>Project: {project.title}</h2>
      {project.description && <p>{project.description}</p>}
      <p>Created: {new Date(project.creationDate).toLocaleDateString()}</p>
      {error && <p className="error-message">{error}</p>}

      <div className="project-actions-row">
        <button onClick={() => { setShowTaskForm(true); setEditingTask(null); setGeneratedSchedule(null); }}>Add New Task</button>
        <button onClick={handleGenerateSchedule} disabled={isScheduling}>
          {isScheduling ? 'Generating Schedule...' : 'Generate Smart Schedule'}
        </button>
      </div>

      {showTaskForm && (
        <div className="task-form-container">
          <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
          <TaskForm
            onSubmit={handleCreateOrUpdateTask}
            initialData={editingTask ? { title: editingTask.title, dueDate: editingTask.dueDate, isCompleted: editingTask.isCompleted, estimatedHours: editingTask.estimatedHours, dependencies: editingTask.dependencies } : undefined}
            isEditMode={!!editingTask}
          />
          <button className="cancel-button" onClick={() => setShowTaskForm(false)}>Cancel</button>
        </div>
      )}

      {generatedSchedule && generatedSchedule.schedule.length > 0 && (
        <div className="generated-schedule-display">
          <h3>Generated Smart Schedule:</h3>
          <ul>
            {generatedSchedule.schedule.map((st, index) => (
              <li key={index}>
                <strong>{st.task}</strong>: {new Date(st.start).toLocaleString()} - {new Date(st.end).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3>Tasks</h3>
      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks for this project yet. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-item">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => handleToggleTaskComplete(task.id, !task.isCompleted)}
              />
              <span style={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                <strong>{task.title}</strong> {task.dueDate && `(Due: ${new Date(task.dueDate).toLocaleDateString()})`} ({task.estimatedHours}h)
                {task.dependencies && task.dependencies.length > 0 && ` [Depends on: ${task.dependencies.join(', ')}]`}
              </span>
              <div className="task-actions">
                <button onClick={() => handleEditTask(task)}>Edit</button>
                <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
