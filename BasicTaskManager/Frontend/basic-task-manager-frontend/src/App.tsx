import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { Task } from './types/task';
import { getTasks, addTask, updateTaskStatus, deleteTask } from './services/taskService';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all'); // New state for filtering

  // Effect to load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem('basicTaskManagerTasks');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
        // If parsing fails, clear localStorage and fetch from API as fallback
        localStorage.removeItem('basicTaskManagerTasks');
        fetchTasks();
      }
    } else {
      // If no tasks in localStorage, fetch from API (which is in-memory)
      fetchTasks();
    }
  }, []); // Empty dependency array means this runs once on mount

  // Effect to save tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem('basicTaskManagerTasks', JSON.stringify(tasks));
  }, [tasks]); // Runs whenever 'tasks' state changes

  const fetchTasks = async () => {
    setError(null);
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks from API.");
    }
  };

  const handleAddTask = async (description: string) => {
    setError(null);
    try {
      // Assuming the API returns the new task with an ID
      const newTask = await addTask(description);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task.");
    }
  };

  const handleToggleComplete = async (id: number, isCompleted: boolean) => {
    setError(null);
    try {
      // Update API, but main persistence is localStorage now
      await updateTaskStatus(id, isCompleted);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, isCompleted: isCompleted } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      setError("Failed to update task status.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    setError(null);
    try {
      // Update API, but main persistence is localStorage now
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task.");
    }
  };

  // Filter tasks based on the current filter state
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.isCompleted);
      case 'active':
        return tasks.filter(task => !task.isCompleted);
      case 'all':
      default:
        return tasks;
    }
  }, [tasks, filter]);

  return (
    <div className="app-container">
      <h1>Basic Task Manager</h1>
      {error && <p className="error-message">{error}</p>}
      <TaskForm onAddTask={handleAddTask} />
      <div className="filter-buttons"> {/* New container for filter buttons */}
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >All</button>
        <button 
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >Active</button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >Completed</button>
      </div>
      <TaskList
        tasks={filteredTasks} /* Pass filtered tasks to TaskList */
        onToggleComplete={handleToggleComplete}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}

export default App;
