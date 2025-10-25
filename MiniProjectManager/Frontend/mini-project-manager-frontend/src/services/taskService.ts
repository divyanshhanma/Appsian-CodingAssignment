import api from '../utils/api';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/task';

export const getTasksByProjectId = async (projectId: string): Promise<Task[]> => {
  const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
  return response.data;
};

export const getTaskById = async (projectId: string, taskId: string): Promise<Task> => {
  const response = await api.get<Task>(`/projects/${projectId}/tasks/${taskId}`);
  return response.data;
};

export const createTask = async (projectId: string, taskData: CreateTaskDto): Promise<Task> => {
  const response = await api.post<Task>(`/projects/${projectId}/tasks`, taskData);
  return response.data;
};

export const updateTask = async (projectId: string, taskId: string, taskData: UpdateTaskDto): Promise<void> => {
  await api.put(`/projects/${projectId}/tasks/${taskId}`, taskData);
};

export const deleteTask = async (projectId: string, taskId: string): Promise<void> => {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
};
