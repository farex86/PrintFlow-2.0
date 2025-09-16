import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';

/**
 * AppLayout - Enterprise-ready layout
 * Wraps all authenticated pages with Header + Sidebar + main content
 */
const drawerWidth = 240;

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header */}
      <Header onMenuClick={handleSidebarToggle} />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={handleSidebarToggle} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: sidebarOpen ? `${drawerWidth}px` : '0px',
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        {/* Toolbar offset */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
