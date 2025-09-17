import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button, Card, CardContent, TextField, IconButton, CircularProgress, Avatar } from '@mui/material';
import { AddCircleOutline, DeleteOutline, Edit } from '@mui/icons-material';
import api from '../config/api';

const BrandProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/brand-profile');
        setProfile(res.data.data);
      } catch (err) {
        setError('Could not load brand profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await api.put('/brand-profile', profile);
      setProfile(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.put('/brand-profile/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(res.data.data);
    } catch (err) {
      console.error("Logo upload failed", err);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*', maxFiles: 1 });

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Brand Profile</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Avatar src={profile.logoUrl} sx={{ width: 80, height: 80, mr: 2 }} />
          <Box {...getRootProps()}>
            <input {...getInputProps()} />
            <Button variant="outlined" component="span">Change Logo</Button>
          </Box>
        </Box>

        {/* Add logic for colors and fonts here, similar to Step3_Branding */}

        <Button variant="contained" onClick={handleUpdate} sx={{ mt: 2 }}>Save Changes</Button>
      </CardContent>
    </Card>
  );
};

export default BrandProfilePage;
