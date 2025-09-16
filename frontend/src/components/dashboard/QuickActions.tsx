import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Box,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Calculate as CalculateIcon,
  Receipt as InvoiceIcon,
  Person as PersonIcon,
  Folder as ProjectIcon,
  Assignment as TaskIcon,
  FlashOn as FlashIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const QuickActions: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'new-project',
      label: 'New Project',
      icon: <ProjectIcon />,
      color: 'primary' as const,
      action: () => navigate('/projects?action=create'),
      description: 'Start a new print project'
    },
    {
      id: 'create-task',
      label: 'Create Task',
      icon: <TaskIcon />,
      color: 'info' as const,
      action: () => navigate('/tasks?action=create'),
      description: 'Add a new task'
    },
    {
      id: 'estimate',
      label: 'Price Estimate',
      icon: <CalculateIcon />,
      color: 'success' as const,
      action: () => navigate('/estimator'),
      description: 'Calculate print costs'
    },
    {
      id: 'new-invoice',
      label: 'New Invoice',
      icon: <InvoiceIcon />,
      color: 'warning' as const,
      action: () => navigate('/invoices?action=create'),
      description: 'Create an invoice'
    },
    {
      id: 'add-lead',
      label: 'Add Lead',
      icon: <PersonIcon />,
      color: 'secondary' as const,
      action: () => navigate('/crm/leads?action=create'),
      description: 'New potential customer'
    },
  ];

  return (
    <Card sx={{ height: 'fit-content' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlashIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
          </Box>
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ pt: 0 }}>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} key={action.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={action.icon}
                  onClick={action.action}
                  sx={{
                    py: 2,
                    px: 2,
                    borderColor: alpha(theme.palette[action.color].main, 0.3),
                    color: theme.palette[action.color].main,
                    backgroundColor: alpha(theme.palette[action.color].main, 0.05),
                    flexDirection: 'column',
                    gap: 0.5,
                    height: 80,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette[action.color].main, 0.1),
                      borderColor: theme.palette[action.color].main,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${alpha(theme.palette[action.color].main, 0.2)}`,
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    {action.label}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}
                  >
                    {action.description}
                  </Typography>
                </Button>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Additional Quick Stats */}
        <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Today's Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                  5
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tasks Due
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                  3
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Projects
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main" sx={{ fontWeight: 700 }}>
                  $2.5k
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Revenue
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
