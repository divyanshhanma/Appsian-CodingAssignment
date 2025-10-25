import React, { useState, useEffect } from 'react';
import { CreateProjectDto, UpdateProjectDto } from '../../types/project';
import './Projects.css'; // Import the CSS file

interface ProjectFormProps {
  onSubmit: (project: CreateProjectDto | UpdateProjectDto) => void;
  initialData?: UpdateProjectDto;
  isEditMode?: boolean;
  onCancel?: () => void; // Added for cancel functionality
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, initialData, isEditMode = false, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long.';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters.';
    }

    if (description && description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        title,
        description: description || undefined,
      });
    }
  };

  return (
    <div className="project-form-container">
      <h3>{isEditMode ? 'Edit Project' : 'Create New Project'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="project-form-group">
          <label htmlFor="projectTitle">Title:</label>
          <input
            type="text"
            id="projectTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>
        <div className="project-form-group">
          <label htmlFor="projectDescription">Description (optional):</label>
          <textarea
            id="projectDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          ></textarea>
          {errors.description && <p className="error-message">{errors.description}</p>}
        </div>
        <div className="project-form-buttons">
          {onCancel && <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>}
          <button type="submit">{isEditMode ? 'Update Project' : 'Create Project'}</button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;


