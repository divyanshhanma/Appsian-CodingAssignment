import axios from 'axios';
import { Task } from '../types/task';

const API_URL = 'http://localhost:5140/tasks';

export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get<Task[]>(API_URL);
  return response.data;
};

export const addTask = async (description: string): Promise<Task> => {
  const response = await axios.post<Task>(API_URL, { description, isCompleted: false });
  return response.data;
};

export const updateTaskStatus = async (id: number, isCompleted: boolean): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, { id, isCompleted });
};

export const deleteTask = async (id: number): Promise<void> => { 
  await axios.delete(`${API_URL}/${id}`);
};
