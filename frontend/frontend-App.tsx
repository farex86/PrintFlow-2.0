import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Fab,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FolderOpen as ProjectsIcon,
  Assignment as TasksIcon,
  People as CRMIcon,
  Receipt as InvoicesIcon,
  Calculate as EstimatorIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Demo data
const demoUsers = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    role: 'Admin', 
    email: 'sarah@printflow.com', 
    avatar: 'S',
    permissions: ['all']
  },
  { 
    id: 2, 
    name: 'Mike Chen', 
    role: 'Designer', 
    email: 'mike@printflow.com', 
    avatar: 'M',
    permissions: ['projects', 'tasks', 'files']
  },
  { 
    id: 3, 
    name: 'Ahmad Al-Rashid', 
    role: 'Client', 
    email: 'ahmad@client.ae', 
    avatar: 'A',
    permissions: ['dashboard', 'projects', 'invoices']
  },
];

const demoKPIs = {
  activeProjects: 12,
  monthlyRevenue: 125000,
  activeLeads: 28,
  profitMargin: 18.5,
  completedTasks: 145,
  pendingInvoices: 8,
};

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, badge: null },
  { id: 'projects', label: 'Projects', icon: <ProjectsIcon />, badge: '12' },
  { id: 'tasks', label: 'Tasks', icon: <TasksIcon />, badge: '23' },
  { id: 'crm', label: 'CRM', icon: <CRMIcon />, badge: '28' },
  { id: 'invoices', label: 'Invoices', icon: <InvoicesIcon />, badge: '8' },
  { id: 'estimator', label: 'Estimator', icon: <EstimatorIcon />, badge: null },
  { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon />, badge: null },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon />, badge: null },
];

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2180a1',
      light: '#4fa8c5',
      dark: '#155a70',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#a2001e',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogin = (selectedUser: any) => {
    setUser(selectedUser);
    localStorage.setItem('printflow_user', JSON.stringify(selectedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('printflow_user');
    setActiveSection('dashboard');
  };

  useEffect(() => {
    // Check for saved user
    const savedUser = localStorage.getItem('printflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Login Screen
  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Container maxWidth="sm">
              <Card sx={{ overflow: 'visible' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box textAlign="center" mb={4}>
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{ 
                          background: 'linear-gradient(45deg, #2180a1, #dc004e)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 800,
                        }}
                      >
                        🖨️ PrintFlow 2.0
                      </Typography>
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        Professional Print Management Platform
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Complete solution for print shops, design agencies, and enterprises
                      </Typography>
                    </motion.div>
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    🚀 Select Demo User:
                  </Typography>

                  <Grid container spacing={2}>
                    {demoUsers.map((demoUser, index) => (
                      <Grid item xs={12} key={demoUser.id}>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          <Card
                            sx={{
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateX(4px)',
                                boxShadow: '0 4px 20px rgba(33, 128, 161, 0.15)',
                              },
                            }}
                            onClick={() => handleLogin(demoUser)}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Avatar
                                  sx={{
                                    bgcolor: 'primary.main',
                                    width: 48,
                                    height: 48,
                                    fontSize: '1.2rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  {demoUser.avatar}
                                </Avatar>
                                <Box flex={1}>
                                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {demoUser.name}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    {demoUser.role} • {demoUser.email}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={`${demoUser.permissions.length} ${demoUser.permissions[0] === 'all' ? 'Full Access' : 'Modules'}`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                  <Box mt={4} textAlign="center">
                    <Typography variant="caption" color="textSecondary">
                      ✨ No registration required • Instant demo access • Full feature preview
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Container>
          </motion.div>
        </Box>
      </ThemeProvider>
    );
  }

  // Sidebar Component
  const sidebar = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          🖨️ PrintFlow 2.0
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Print Management Platform
        </Typography>
      </Box>

      <List sx={{ p: 1 }}>
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          const hasPermission = user.permissions.includes('all') || user.permissions.includes(item.id);
          
          if (!hasPermission && item.id !== 'dashboard') return null;

          return (
            <ListItem
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobile) setSidebarOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                cursor: 'pointer',
                bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  bgcolor: isActive 
                    ? alpha(theme.palette.primary.main, 0.15) 
                    : alpha(theme.palette.primary.main, 0.05),
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary' }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'primary.main' : 'text.primary',
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  // Main Content Component
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              Welcome back, {user.name}! 👋
            </Typography>
            
            <Grid container spacing={3} mb={4}>
              {[
                { label: 'Active Projects', value: demoKPIs.activeProjects, icon: '📊', color: 'primary' },
                { label: 'Monthly Revenue', value: `$${demoKPIs.monthlyRevenue.toLocaleString()}`, icon: '💰', color: 'success' },
                { label: 'Active Leads', value: demoKPIs.activeLeads, icon: '👥', color: 'info' },
                { label: 'Profit Margin', value: `${demoKPIs.profitMargin}%`, icon: '📈', color: 'warning' },
              ].map((kpi, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              {kpi.label}
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: `${kpi.color}.main` }}>
                              {kpi.value}
                            </Typography>
                          </Box>
                          <Typography variant="h3" sx={{ opacity: 0.3 }}>
                            {kpi.icon}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  🎉 PrintFlow 2.0 - Feature Overview
                </Typography>
                <Grid container spacing={2} mt={1}>
                  {[
                    { icon: '📊', title: 'Project Management', desc: 'Kanban boards, timelines, team collaboration' },
                    { icon: '👥', title: 'CRM System', desc: 'Lead management, customer tracking, sales pipeline' },
                    { icon: '🧮', title: 'Print Estimator', desc: 'AI-powered cost calculation, bulk pricing' },
                    { icon: '💳', title: 'Invoicing', desc: 'Professional invoices, payment tracking' },
                    { icon: '📈', title: 'Analytics', desc: 'Business intelligence, performance metrics' },
                    { icon: '🌍', title: 'Multi-language', desc: 'English/Arabic support, RTL layout' },
                  ].map((feature, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box display="flex" alignItems="center" gap={2} p={1}>
                        <Typography variant="h6">{feature.icon}</Typography>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {feature.desc}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        );
      
      default:
        return (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{ minHeight: 400 }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h3" sx={{ mb: 2, opacity: 0.3 }}>
                  🚧
                </Typography>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {menuItems.find(item => item.id === activeSection)?.label} Module
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                  This module is ready for implementation. The complete PrintFlow 2.0 
                  codebase includes all components and functionality.
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ✨ Available features: Full CRUD operations, real-time updates, 
                  responsive design, and advanced filtering.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar for Desktop */}
        {!isMobile && (
          <Box
            component="nav"
            sx={{
              width: 280,
              flexShrink: 0,
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            {sidebar}
          </Box>
        )}

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {sidebar}
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Top App Bar */}
          <AppBar 
            position="static" 
            elevation={0} 
            sx={{ 
              bgcolor: 'background.paper', 
              color: 'text.primary',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Toolbar>
              {isMobile && (
                <IconButton
                  edge="start"
                  onClick={() => setSidebarOpen(true)}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </Typography>

              <IconButton>
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton sx={{ ml: 1 }}>
                <AccountCircle />
              </IconButton>

              <Button
                startIcon={<Logout />}
                onClick={handleLogout}
                variant="outlined"
                size="small"
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>

          {/* Page Content */}
          <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, bgcolor: 'background.default' }}>
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </Box>
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: { xs: 80, md: 24 },
            right: 24,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </ThemeProvider>
  );
}

export default App;
