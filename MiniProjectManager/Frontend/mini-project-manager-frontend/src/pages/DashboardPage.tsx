import React, { useEffect, useState } from 'react';
import { Project, CreateProjectDto } from '../types/project';
import { getProjects, createProject, deleteProject } from '../services/projectService';
import { Link } from 'react-router-dom';
import ProjectForm from '../components/Projects/ProjectForm'; // Import ProjectForm
import '../components/Projects/Projects.css'; // Import the CSS file

const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  // const [newProjectTitle, setNewProjectTitle] = useState(''); // Removed
  // const [newProjectDescription, setNewProjectDescription] = useState(''); // Removed
  const [showProjectForm, setShowProjectForm] = useState(false); // New state for project form visibility
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    } catch (err) {
      setError('Failed to fetch projects.');
      console.error(err);
    }
  };

  const handleCreateProject = async (projectData: CreateProjectDto) => {
    setError(null);
    try {
      const createdProject = await createProject(projectData);
      setProjects((prev) => [...prev, createdProject]);
      setShowProjectForm(false); // Hide form after successful creation
    } catch (err) {
      setError('Failed to create project.');
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProject(id.toString());
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Failed to delete project.');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Your Projects</h2>
      {error && <p className="error-message">{error}</p>}

      <button onClick={() => setShowProjectForm(true)}>Create New Project</button>

      {showProjectForm && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowProjectForm(false)} // Pass cancel handler
        />
      )}

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p>No projects yet. Create one above!</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>
                <Link to={`/projects/${project.id}`}>{project.title}</Link>
              </h3>
              {project.description && <p>{project.description}</p>}
              <div className="project-card-footer">
                <span>Created: {new Date(project.creationDate).toLocaleDateString()}</span>
                <div className="project-card-actions">
                  <button className="delete-button" onClick={() => handleDeleteProject(project.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
