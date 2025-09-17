import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button, Card, CardContent, TextField, IconButton } from '@mui/material';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';
import api from '../../config/api'; // For direct api access for file upload

const Step3_Branding = ({ onNext }) => {
  const [logo, setLogo] = useState(null);
  const [colors, setColors] = useState([{ name: '', hex: '#ffffff' }]);

  const onDrop = (acceptedFiles) => {
    setLogo(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 1,
  });

  const handleColorChange = (index, event) => {
    const newColors = [...colors];
    newColors[index][event.target.name] = event.target.value;
    setColors(newColors);
  };

  const addColor = () => {
    setColors([...colors, { name: '', hex: '#ffffff' }]);
  };

  const removeColor = (index) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 1. Upload logo if it exists
    if (logo) {
      const formData = new FormData();
      formData.append('file', logo);
      try {
        await api.put('/brand-profile/logo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (err) {
        console.error("Logo upload failed", err);
        // Handle error display to user
        return;
      }
    }
    // 2. Update brand profile with colors
    try {
        await api.put('/brand-profile', { colors });
    } catch(err) {
        console.error("Brand profile update failed", err);
        return;
    }

    // 3. Move to next step
    onNext('brand-profile');
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Brand Profile</Typography>
        <form onSubmit={handleSubmit}>
          <Typography sx={{ mt: 2, mb: 1 }}>Brand Logo</Typography>
          <Box {...getRootProps()} sx={{ border: '2px dashed grey', borderRadius: 2, p: 4, textAlign: 'center', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            {logo ? <p>{logo.name}</p> : <p>Drag 'n' drop a logo here, or click to select a file</p>}
          </Box>

          <Typography sx={{ mt: 3, mb: 1 }}>Brand Colors</Typography>
          {colors.map((color, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField name="name" label="Color Name" value={color.name} onChange={(e) => handleColorChange(index, e)} sx={{ mr: 1 }} />
              <TextField name="hex" label="Hex Code" value={color.hex} onChange={(e) => handleColorChange(index, e)} sx={{ mr: 1, width: '120px' }} />
              <IconButton onClick={() => removeColor(index)}><DeleteOutline /></IconButton>
            </Box>
          ))}
          <Button startIcon={<AddCircleOutline />} onClick={addColor}>Add Color</Button>

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, display: 'block' }}>Continue</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Step3_Branding;
