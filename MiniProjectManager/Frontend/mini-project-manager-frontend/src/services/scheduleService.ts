import api from "../utils/api";
import { ScheduleTaskRequest, ScheduleResponse } from "../types/schedule";

export const generateSchedule = async (projectId: number, request: ScheduleTaskRequest): Promise<ScheduleResponse> => {
  const response = await api.post(`/v1/projects/${projectId}/scheduling/schedule`, request);
  return response.data;
};

