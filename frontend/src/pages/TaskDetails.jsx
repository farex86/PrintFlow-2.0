import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import taskService from "../services/taskService";

const statusColors = {
  active: "success",
  completed: "primary",
  "in-progress": "warning",
  pending: "default",
};

const TaskDetails = () => {
  const { taskId } = useParams();

  // Fetch task by ID
  const { data, isLoading, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskService.getById(taskId),
    enabled: !!taskId,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data?.task) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">Failed to load task details.</Typography>
      </Box>
    );
  }

  const task = data.task;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            {task.title}
          </Typography>
          <Typography variant="body1" mb={2}>
            {task.description || "No description available."}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">Priority: {task.priority}</Typography>
          <Typography variant="subtitle1">Deadline: {task.deadline || "-"}</Typography>

          <Box mt={2}>
            <Chip
              label={task.status}
              color={statusColors[task.status] || "default"}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaskDetails;
