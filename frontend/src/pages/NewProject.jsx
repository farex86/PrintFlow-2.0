import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  MenuItem, CircularProgress, Alert
} from '@mui/material';
import projectService from '../services/projectService';
import { useQueryClient } from '@tanstack/react-query';

const categories = [
  'brochure', 'business-card', 'banner', 'poster', 'book', 'packaging', 'other'
];

const priorities = ['low', 'medium', 'high', 'urgent'];
const statuses = ['draft', 'active', 'on-hold', 'completed', 'cancelled'];

const NewProject = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priority: 'medium',
    status: 'draft',
    deadline: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.category) {
      setError('Project name and category are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await projectService.create(formData);

      if (res.success) {
        // Refresh projects list
        queryClient.invalidateQueries(['projects']);
        navigate('/dashboard');
      } else {
        setError(res.message || 'Failed to create project.');
      }
    } catch (err) {
      setError(err.message || 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>Create New Project</Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Project Name"
              name="name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              minRows={3}
              value={formData.description}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              select
              label="Category"
              name="category"
              fullWidth
              required
              value={formData.category}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </TextField>

            <TextField
              select
              label="Priority"
              name="priority"
              fullWidth
              value={formData.priority}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {priorities.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>

            <TextField
              select
              label="Status"
              name="status"
              fullWidth
              value={formData.status}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>

            <TextField
              type="date"
              label="Deadline"
              name="deadline"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.deadline}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewProject;
