import React from 'react';
import {
  useDroppable,
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import { Add as AddIcon, MoreVert as MoreIcon } from '@mui/icons-material';
import TaskCard from './TaskCard';

const KanbanColumn = ({ column, tasks, onAddTask }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map(task => task.id);

  const getStatusColor = (status) => {
    const colors = {
      backlog: '#757575',
      todo: '#2196f3',
      in_progress: '#ff9800',
      review: '#9c27b0',
      done: '#4caf50',
      blocked: '#f44336'
    };
    return colors[status] || '#757575';
  };

  return (
    <Paper
      className="kanban-column"
      elevation={2}
      sx={{
        minWidth: 300,
        maxWidth: 300,
        backgroundColor: '#fafafa',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Column Header */}
      <Box
        className="column-header"
        sx={{
          backgroundColor: getStatusColor(column.id),
          color: 'white',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            {column.title}
          </Typography>
          <Chip
            label={tasks.length}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
        <Box>
          <IconButton
            size="small"
            onClick={() => onAddTask(column.id)}
            sx={{ color: 'white' }}
          >
            <AddIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: 'white' }}>
            <MoreIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      {/* Column Content */}
      <Box
        ref={setNodeRef}
        className="column-content"
        sx={{
          minHeight: 400,
          maxHeight: 'calc(100vh - 300px)',
          overflow: 'auto',
          p: 1
        }}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <Box
              className="empty-column"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
                border: '2px dashed #ccc',
                borderRadius: 2,
                color: '#666',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  borderColor: '#999'
                }
              }}
              onClick={() => onAddTask(column.id)}
            >
              <Box textAlign="center">
                <AddIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                <Typography variant="body2">
                  Add your first task
                </Typography>
              </Box>
            </Box>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </SortableContext>
      </Box>
    </Paper>
  );
};

export default KanbanColumn;
