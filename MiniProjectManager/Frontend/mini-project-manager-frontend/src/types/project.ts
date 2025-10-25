export interface Project {
    id: number;
    title: string;
    description?: string;
    creationDate: string;
    userId: number;
}

export interface CreateProjectDto {
    title: string;
    description?: string;
}

export interface UpdateProjectDto {
    title: string;
    description?: string;
}
