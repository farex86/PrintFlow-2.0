import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  AttachFile as AttachIcon,
  Comment as CommentIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { format, isOverdue, differenceInDays } from 'date-fns';

const TaskCard = ({ task, isDragging = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      lowest: '#4caf50',
      low: '#8bc34a',
      medium: '#ff9800',
      high: '#f44336',
      highest: '#9c27b0'
    };
    return colors[priority] || '#757575';
  };

  const getTypeIcon = (type) => {
    // You can add different icons for different task types
    return <FlagIcon fontSize="small" />;
  };

  const calculateProgress = () => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(subtask => subtask.completed).length;
    return (completed / task.subtasks.length) * 100;
  };

  const isTaskOverdue = task.timeline?.dueDate && isOverdue(new Date(task.timeline.dueDate));
  const daysUntilDue = task.timeline?.dueDate 
    ? differenceInDays(new Date(task.timeline.dueDate), new Date())
    : null;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
      sx={{
        mb: 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ pb: '8px !important' }}>
        {/* Task Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            {getTypeIcon(task.type)}
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontSize: '0.75rem' }}
            >
              {task.id?.slice(-6) || 'NEW'}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{ padding: '2px' }}
          >
            <MoreIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Task Title */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {task.title}
        </Typography>

        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <Box display="flex" gap={0.5} mb={1} flexWrap="wrap">
            {task.labels.slice(0, 3).map((label, index) => (
              <Chip
                key={index}
                label={label}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
            {task.labels.length > 3 && (
              <Chip
                label={`+${task.labels.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
        )}

        {/* Progress Bar for Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <Box mb={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="caption" color="textSecondary">
                Subtasks
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculateProgress()}
              sx={{ height: 4, borderRadius: 2 }}
            />
          </Box>
        )}

        {/* Due Date */}
        {task.timeline?.dueDate && (
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <ScheduleIcon sx={{ fontSize: 14 }} />
            <Typography
              variant="caption"
              sx={{
                color: isTaskOverdue ? 'error.main' : 'textSecondary',
                fontWeight: isTaskOverdue ? 600 : 400
              }}
            >
              {daysUntilDue === 0 && 'Due Today'}
              {daysUntilDue === 1 && 'Due Tomorrow'}
              {daysUntilDue > 1 && `Due in ${daysUntilDue} days`}
              {daysUntilDue < 0 && `Overdue by ${Math.abs(daysUntilDue)} days`}
            </Typography>
          </Box>
        )}

        {/* Task Footer */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            {/* Attachments Count */}
            {task.attachments && task.attachments.length > 0 && (
              <Box display="flex" alignItems="center" gap={0.25}>
                <AttachIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" color="textSecondary">
                  {task.attachments.length}
                </Typography>
              </Box>
            )}

            {/* Comments Count */}
            {task.comments && task.comments.length > 0 && (
              <Box display="flex" alignItems="center" gap={0.25}>
                <CommentIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" color="textSecondary">
                  {task.comments.length}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Assignee Avatar */}
          {task.assignee && (
            <Tooltip title={task.assignee.name}>
              <Avatar
                src={task.assignee.avatar}
                sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
              >
                {task.assignee.name.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          )}
        </Box>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
          <MenuItem onClick={handleMenuClose}>Edit Task</MenuItem>
          <MenuItem onClick={handleMenuClose}>Assign to Me</MenuItem>
          <MenuItem onClick={handleMenuClose}>Copy Link</MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            Delete Task
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
