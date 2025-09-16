import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import projectService from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';

const ProjectForm = () => {
  const { id } = useParams(); // Project ID if editing
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    priority: 'medium',
    category: '',
    budget_amount: '',
    budget_currency: 'USD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load project data if editing
  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    const result = await projectService.getById(id);
    if (result.success) {
      setFormData(result.project);
    } else {
      if (result.message === 'Unauthorized') {
        navigate('/login');
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let result;

    if (id) {
      result = await projectService.update(id, formData);
    } else {
      result = await projectService.create(formData);
    }

    if (result.success) {
      navigate('/projects'); // Go back to projects list
    } else {
      if (result.message === 'Unauthorized') {
        navigate('/login');
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Project' : 'New Project'}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On-Hold</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Budget Amount</label>
            <input
              type="number"
              name="budget_amount"
              value={formData.budget_amount}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium">Currency</label>
            <select
              name="budget_currency"
              value={formData.budget_currency}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="AED">AED</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
