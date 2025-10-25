import api from '../utils/api';
import { AuthResponse } from '../types/auth';

export const register = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/Auth/register', { username, password });
  return response.data;
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/Auth/login', { username, password });
  return response.data;
};
