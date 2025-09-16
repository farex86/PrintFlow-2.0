import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Box, Typography, Button, Dialog, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import TaskForm from '../tasks/TaskForm';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskStatus, updateTaskPosition } from '../../store/taskSlice';
import { useWebSocket } from '../../hooks/useWebSocket';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: '#757575' },
  { id: 'todo', title: 'To Do', color: '#2196f3' },
  { id: 'in_progress', title: 'In Progress', color: '#ff9800' },
  { id: 'review', title: 'Review', color: '#9c27b0' },
  { id: 'done', title: 'Done', color: '#4caf50' }
];

const KanbanBoard = ({ projectId }) => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector(state => state.tasks);
  const [activeId, setActiveId] = useState(null);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('backlog');

  // WebSocket for real-time updates
  const socket = useWebSocket();

  useEffect(() => {
    if (socket && projectId) {
      socket.emit('join_project', projectId);
      
      socket.on('task_updated', (data) => {
        // Update task in store
        dispatch(updateTaskStatus(data));
      });
    }
  }, [socket, projectId, dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group tasks by status
  const tasksByStatus = COLUMNS.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the containers
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    // Moving task to different column
    const activeTask = tasks.find(task => task.id === activeId);
    if (activeTask && activeTask.status !== overContainer) {
      dispatch(updateTaskStatus({
        taskId: activeId,
        status: overContainer,
        projectId
      }));

      // Emit real-time update
      socket?.emit('task_update', {
        taskId: activeId,
        status: overContainer,
        projectId
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;

    if (!activeContainer || !overContainer) {
      return;
    }

    const activeIndex = tasksByStatus[activeContainer].findIndex(task => task.id === activeId);
    const overIndex = tasksByStatus[overContainer].findIndex(task => task.id === overId);

    if (activeContainer === overContainer) {
      // Reordering within same column
      const newTasks = arrayMove(tasksByStatus[activeContainer], activeIndex, overIndex);
      
      // Update positions
      newTasks.forEach((task, index) => {
        dispatch(updateTaskPosition({
          taskId: task.id,
          position: index
        }));
      });
    }
  };

  const findContainer = (id) => {
    const task = tasks.find(task => task.id === id);
    return task?.status;
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId);
    setTaskFormOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <div className="loading-spinner" />
      </Box>
    );
  }

  return (
    <Box className="kanban-board">
      <Box className="kanban-header" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Kanban Board
        </Typography>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box className="kanban-columns" display="flex" gap={2} overflow="auto" pb={2}>
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.id] || []}
              onAddTask={handleAddTask}
            />
          ))}
        </Box>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <Fab
        color="primary"
        aria-label="add task"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleAddTask('backlog')}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <TaskForm
          projectId={projectId}
          defaultStatus={selectedColumn}
          onClose={() => setTaskFormOpen(false)}
        />
      </Dialog>
    </Box>
  );
};

export default KanbanBoard;
