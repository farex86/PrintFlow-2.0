import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button, Card, CardContent, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import api from '../../config/api';

const Step4_Documents = ({ onNext }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeFile = (fileToRemove) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file)); // The backend upload middleware expects 'files'

      try {
        // I'll need a new endpoint for this. For now, I'll assume it's /api/files/upload/onboarding
        // This is a gap I need to fill in the backend.
        // For now, I will assume the endpoint exists.
        await api.post('/files/upload/onboarding', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (err) {
        console.error("File upload failed", err);
        return;
      }
    }

    onNext('completed');
  };

  const fileList = files.map(file => (
    <ListItem key={file.path} secondaryAction={<IconButton edge="end" onClick={() => removeFile(file)}><DeleteOutline /></IconButton>}>
      <ListItemText primary={file.path} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
    </ListItem>
  ));

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Upload Documents</Typography>
        <Typography color="text.secondary" mb={2}>Upload any contracts, briefs, or other relevant documents.</Typography>
        <form onSubmit={handleSubmit}>
          <Box {...getRootProps()} sx={{ border: '2px dashed grey', borderRadius: 2, p: 4, textAlign: 'center', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </Box>
          {files.length > 0 && <List dense>{fileList}</List>}
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>Finish Onboarding</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Step4_Documents;
