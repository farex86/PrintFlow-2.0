// src/pages/Projects.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectService from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';

const Projects = () => {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
    const result = await projectService.getAll();
    if (result.success) setProjects(result.projects);
    else setError(result.message);
    setLoading(false);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const result = await projectService.delete(id);
      if (result.success) setProjects(projects.filter((p) => p._id !== id));
      else setError(result.message);
    }
  };

  if (authLoading || loading)
    return <div className="text-center mt-10">Loading projects...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          to="/projects/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Project
        </Link>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {projects.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No projects found. Create one!</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="border rounded shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{project.name}</h2>
                <p className="text-gray-600 mt-1">{project.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Status: <span className="font-medium">{project.status}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Category: <span className="font-medium">{project.category}</span>
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Link
                  to={`/projects/${project._id}/edit`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
