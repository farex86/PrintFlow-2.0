import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import {
  Box, Grid, Card, CardContent, Typography, Chip, CircularProgress, Divider,
  Table, TableBody, TableCell, TableRow, TableHead, TableContainer, Paper, Button
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

// Animated counter component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count}</>;
};

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch projects
  const {
    data: projectsResult,
    isLoading: loadingProjects
  } = useQuery({ queryKey: ['projects'], queryFn: projectService.getAll });

  // Fetch tasks
  const {
    data: tasksResult,
    isLoading: loadingTasks
  } = useQuery({ queryKey: ['tasks'], queryFn: taskService.getAll });

  const loading = loadingProjects || loadingTasks;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const projects = projectsResult?.projects || [];
  const tasks = tasksResult?.tasks || [];

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
  };

  const recentProjects = projects.slice(0, 5);
  const recentTasks = tasks.slice(0, 5);

  const statusColors = {
    active: 'success',
    completed: 'primary',
    'in-progress': 'warning',
    pending: 'default'
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your projects and tasks.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        {[
          { label: 'Total Projects', value: stats.totalProjects, color: 'primary' },
          { label: 'Active Projects', value: stats.activeProjects, color: 'success' },
          { label: 'Total Tasks', value: stats.totalTasks, color: 'warning' },
          { label: 'Completed Tasks', value: stats.completedTasks, color: 'secondary' }
        ].map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h5" fontWeight={600}><AnimatedCounter value={stat.value} /></Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add buttons */}
      <Box display="flex" justifyContent="flex-end" mb={2} gap={2}>
        <Link to="/projects/new">
          <Button variant="contained" color="primary">+ New Project</Button>
        </Link>
        <Link to="/tasks/new">
          <Button variant="contained" color="primary">+ New Task</Button>
        </Link>
      </Box>

      {/* Recent Projects & Tasks */}
      <Grid container spacing={3}>
        {/* Recent Projects */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Projects</Typography>
                <Link to="/projects">View all</Link>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {recentProjects.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Project Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentProjects.map((project) => (
                        <TableRow key={project._id}>
                          <TableCell>{project.name}</TableCell>
                          <TableCell>{project.category || '-'}</TableCell>
                          <TableCell>
                            <Chip label={project.status} color={statusColors[project.status] || 'default'} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography textAlign="center" color="text.secondary" mt={2}>No projects yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Tasks</Typography>
                <Link to="/tasks">View all</Link>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {recentTasks.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Task Title</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentTasks.map((task) => (
                        <TableRow key={task._id}>
                          <TableCell>{task.title}</TableCell>
                          <TableCell>{task.priority || '-'}</TableCell>
                          <TableCell>
                            <Chip label={task.status} color={statusColors[task.status] || 'default'} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography textAlign="center" color="text.secondary" mt={2}>No tasks yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
