import api from '../utils/api';
import { Project, CreateProjectDto, UpdateProjectDto } from '../types/project';

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/Projects');
  return response.data;
};

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await api.get<Project>(`/Projects/${id}`);
  return response.data;
};

export const createProject = async (projectData: CreateProjectDto): Promise<Project> => {
  const response = await api.post<Project>('/Projects', projectData);
  return response.data;
};

export const updateProject = async (id: string, projectData: UpdateProjectDto): Promise<void> => {
  await api.put(`/Projects/${id}`, projectData);
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/Projects/${id}`);
};
