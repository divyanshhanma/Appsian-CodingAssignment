export interface Task {
    id: number;
    title: string;
    dueDate?: string;
    isCompleted: boolean;
    projectId: number;
    estimatedHours: number;
    dependencies: string[];
}

export interface CreateTaskDto {
    title: string;
    dueDate?: string;
    estimatedHours: number;
    dependencies: string[];
}

export interface UpdateTaskDto {
    title: string;
    dueDate?: string;
    isCompleted: boolean;
    estimatedHours: number;
    dependencies: string[];
}
