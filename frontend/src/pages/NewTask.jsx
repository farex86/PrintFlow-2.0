// src/pages/NewTask.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, TextField, Button, MenuItem, Typography, CircularProgress } from '@mui/material';
import taskService from '../services/taskService';
import projectService from '../services/projectService';

const NewTask = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    project: projectId || ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch projects if no projectId
    if (!projectId) {
      projectService.getAll().then(res => {
        if (res.success) setProjects(res.projects);
      });
    }
  }, [projectId]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await taskService.create(form);
    setLoading(false);

    if (res.success) {
      navigate(`/tasks/${res.task._id}`);
    } else {
      alert(res.message || 'Failed to create task');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" mb={3}>New Task</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        {!projectId && (
          <TextField
            select
            fullWidth
            label="Project"
            name="project"
            value={form.project}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          >
            {projects.map(p => (
              <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          select
          fullWidth
          label="Priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          {['low', 'medium', 'high', 'urgent'].map(p => (
            <MenuItem key={p} value={p}>{p}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          sx={{ mb: 3 }}
        >
          {['pending', 'in-progress', 'completed'].map(s => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Create Task'}
        </Button>
      </form>
    </Box>
  );
};

export default NewTask;
