import React, { useState } from 'react';
import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';

const CreateRecipe = () => {
  // Assuming 'userId' is stored in localStorage when the user logs in
  const creatorId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    ingredients: '',
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!creatorId) {
      setError('Please log in to create a recipe.');
      return;
    }

    const data = new FormData();
    data.append('image', file);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('creatorId', creatorId);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/recipe/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Handle success
      console.log(response.data);
      alert('Recipe created successfully!');  //Design a different kind of alert box.
      setFormData({ name: '', description: '', tags: '', ingredients: '' });
      setFile(null);
      setFileName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '93vh', overflow: 'hidden' }}>
      {/* Image side */}
      <Grid item xs={false} sm={4} md={7} sx={{
        backgroundImage: 'url(http://localhost:5000/images/createRecipe.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      {/* Form side */}

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">Create a New Recipe</Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {/* Form fields */}
            <TextField margin="normal" required fullWidth id="name" label="Recipe Name" name="name" autoComplete="name" autoFocus value={formData.name} onChange={handleChange} />
            <TextField margin="normal" required fullWidth name="description" label="Description" type="description" id="description" autoComplete="description" multiline rows={4} value={formData.description} onChange={handleChange} />
            <TextField margin="normal" required fullWidth name="ingredients" label="Ingredients" type="ingredients" id="ingredients" autoComplete="ingredients" value={formData.ingredients} onChange={handleChange} />
            <TextField margin="normal" required fullWidth name="tags" label="Tags" type="tags" id="tags" autoComplete="tags" value={formData.tags} onChange={handleChange} />
            {/* File upload feedback */}
            {fileName && <Typography variant="subtitle1" gutterBottom>Selected file: {fileName}</Typography>}
            {/* Image upload button */}
            <Button variant="contained" component="label" fullWidth sx={{ mt: 3, mb: 2, color: 'white', backgroundColor: 'green' }}>
              Upload Image
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {/* Loading indicator */}
            {loading && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />}
            {/* Submit button */}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, backgroundColor: 'green' }}>Create Recipe</Button>
            {/* Error message */}
            {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CreateRecipe;

