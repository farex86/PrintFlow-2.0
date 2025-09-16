import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Box,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  ViewKanban as ViewKanbanIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarTodayIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Projects', icon: <FolderIcon />, path: '/projects' },
    { text: 'Kanban', icon: <ViewKanbanIcon />, path: '/kanban' },
    { text: 'Print Jobs', icon: <PrintIcon />, path: '/print-jobs' },
    { text: 'Invoices', icon: <ReceiptIcon />, path: '/invoices' },
    { text: 'Calendar', icon: <CalendarTodayIcon />, path: '/calendar' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics', roles: ['admin', 'manager'] },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      {/* Close Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => {
          // Role-based access
          if (item.roles && !item.roles.includes(user.role)) return null;

          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.text}
              to={item.path}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Tooltip title={item.text} placement="right" arrow>
                <ListItem button selected={isActive}>
                  <ListItemIcon sx={{ color: isActive ? theme.palette.primary.main : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ fontWeight: isActive ? 600 : 400 }}
                  />
                </ListItem>
              </Tooltip>
            </Link>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
