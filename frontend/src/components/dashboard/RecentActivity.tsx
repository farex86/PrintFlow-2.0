import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Folder as ProjectIcon,
  Assignment as TaskIcon,
  Receipt as InvoiceIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  avatar: string;
  priority?: 'low' | 'medium' | 'high';
}

interface RecentActivityProps {
  activities: Activity[];
  onRefresh?: () => void;
  refreshKey?: number;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities, 
  onRefresh,
  refreshKey = 0 
}) => {
  const theme = useTheme();

  const getActivityIcon = (type: string) => {
    const iconProps = { fontSize: 'small' as const };
    switch (type) {
      case 'project_created':
      case 'project_updated':
        return <ProjectIcon {...iconProps} />;
      case 'task_completed':
      case 'task_created':
        return <TaskIcon {...iconProps} />;
      case 'invoice_sent':
      case 'invoice_paid':
        return <InvoiceIcon {...iconProps} />;
      case 'lead_created':
      case 'customer_added':
        return <PersonIcon {...iconProps} />;
      default:
        return <TimelineIcon {...iconProps} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'project_created':
        return 'primary';
      case 'task_completed':
        return 'success';
      case 'invoice_sent':
        return 'warning';
      case 'invoice_paid':
        return 'success';
      case 'lead_created':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Card sx={{ height: 600 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Activity
            </Typography>
          </Box>
        }
        action={
          <IconButton 
            onClick={onRefresh} 
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
            }}
          >
            <RefreshIcon />
          </IconButton>
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ pt: 0, pb: 0, height: 'calc(100% - 64px)', overflow: 'hidden' }}>
        {activities.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
            }}
          >
            <TimelineIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body2">
              No recent activity
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            <List sx={{ p: 0 }}>
              <AnimatePresence>
                {activities.map((activity, index) => (
                  <motion.div
                    key={`${activity.id}-${refreshKey}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ListItem
                      sx={{
                        px: 0,
                        py: 2,
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <ListItemAvatar>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            sx={{
                              bgcolor: `${getActivityColor(activity.type)}.main`,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {getActivityIcon(activity.type)}
                          </Avatar>
                          {activity.priority && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: getPriorityColor(activity.priority),
                                border: `2px solid ${theme.palette.background.paper}`,
                              }}
                            />
                          )}
                        </Box>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ mb: 0.5 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 0.5
                              }}
                            >
                              {activity.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ fontSize: '0.875rem' }}
                            >
                              {activity.description}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mt: 1
                          }}>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </Typography>
                            <Chip
                              label={activity.user}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                height: 20, 
                                fontSize: '0.7rem',
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && (
                      <Divider sx={{ opacity: 0.5 }} />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
