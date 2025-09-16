import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import KPICard from '../components/dashboard/KPICard';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';

// Mock data
const mockKPIs = [
  {
    id: 'revenue',
    title: 'Monthly Revenue',
    value: 125000,
    change: 12.5,
    trend: 'up' as const,
    format: 'currency' as const,
    color: 'primary' as const,
    icon: '💰',
    description: 'Total revenue this month',
  },
  {
    id: 'projects',
    title: 'Active Projects',
    value: 12,
    change: 8.3,
    trend: 'up' as const,
    format: 'number' as const,
    color: 'info' as const,
    icon: '📊',
    description: 'Currently ongoing projects',
  },
  {
    id: 'leads',
    title: 'Active Leads',
    value: 28,
    change: 15.2,
    trend: 'up' as const,
    format: 'number' as const,
    color: 'success' as const,
    icon: '🎯',
    description: 'Potential new customers',
  },
  {
    id: 'profit',
    title: 'Profit Margin',
    value: 18.5,
    change: 2.1,
    trend: 'up' as const,
    format: 'percentage' as const,
    color: 'warning' as const,
    icon: '📈',
    description: 'Current profit margin',
  },
];

const mockActivities = [
  {
    id: '1',
    type: 'project_created',
    title: 'New project "Business Cards Design" created',
    description: 'Project assigned to Mike Chen',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    user: 'Sarah Johnson',
    avatar: 'S',
    priority: 'medium' as const,
  },
  {
    id: '2',
    type: 'task_completed',
    title: 'Design review task completed',
    description: 'Marketing brochure design approved',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    user: 'Mike Chen',
    avatar: 'M',
    priority: 'high' as const,
  },
  {
    id: '3',
    type: 'invoice_sent',
    title: 'Invoice #INV-2025-001 sent',
    description: 'Invoice for $2,500 sent to Tech Startup Inc.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    user: 'Sarah Johnson',
    avatar: 'S',
    priority: 'low' as const,
  },
  {
    id: '4',
    type: 'lead_created',
    title: 'New lead added',
    description: 'Restaurant chain interested in menu design',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    user: 'Ahmad Al-Rashid',
    avatar: 'A',
    priority: 'medium' as const,
  },
  {
    id: '5',
    type: 'project_updated',
    title: 'Project deadline extended',
    description: 'Product catalog delivery moved to next week',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    user: 'Sarah Johnson',
    avatar: 'S',
    priority: 'low' as const,
  },
];

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshKey(prev => prev + 1);
    setIsLoading(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentUser = JSON.parse(localStorage.getItem('printflow_user') || '{"name": "User"}');

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 },
          mb: 1 
        }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2180a1, #1565c0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {getGreeting()}, {currentUser.name?.split(' ')[0]}! 👋
            </Typography>
          </motion.div>
          
          <IconButton 
            onClick={handleRefresh} 
            disabled={isLoading}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              '&:disabled': { bgcolor: 'grey.300' }
            }}
          >
            <RefreshIcon sx={{ 
              animation: isLoading ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              }
            }} />
          </IconButton>
        </Box>
        
        <Typography variant="body1" color="text.secondary">
          Welcome to your PrintFlow dashboard. Here's what's happening today.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {mockKPIs.map((kpi, index) => (
            <Grid item xs={12} sm={6} lg={3} key={kpi.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <KPICard {...kpi} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <QuickActions />
          </motion.div>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <RecentActivity 
              activities={mockActivities} 
              onRefresh={handleRefresh}
              refreshKey={refreshKey}
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Floating Action Button (Mobile) */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 90, // Above bottom navigation
            right: 16,
            zIndex: theme.zIndex.fab,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default DashboardPage;
