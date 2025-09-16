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
import projectService from "../services/projectService";

const statusColors = {
  active: "success",
  completed: "primary",
  "in-progress": "warning",
  pending: "default",
  "on-hold": "secondary",
  draft: "default",
};

const ProjectDetails = () => {
  const { projectId } = useParams();

  // Fetch project by ID
  const { data, isLoading, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectService.getById(projectId),
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data?.project) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">Failed to load project details.</Typography>
      </Box>
    );
  }

  const project = data.project;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, px: 2 }}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            {project.name}
          </Typography>
          <Typography variant="body1" mb={2}>
            {project.description || "No description available."}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">
            Category: {project.category || "-"}
          </Typography>
          <Typography variant="subtitle1">Priority: {project.priority}</Typography>
          <Typography variant="subtitle1">Deadline: {project.deadline || "-"}</Typography>

          <Box mt={2}>
            <Chip
              label={project.status}
              color={statusColors[project.status] || "default"}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProjectDetails;
