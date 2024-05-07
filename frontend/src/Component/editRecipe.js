import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, CircularProgress, Container } from '@mui/material';

const EditRecipe = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    imagePath: '',
    tags: '',
    ingredients: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/recipe/recipeId/${id}`);
        console.log(response.data); // Log fetched recipe details
        setRecipe(response.data);
      } catch (err) {
        console.error('Failed to fetch recipe details:',  err.response ? err.response.data : err);
        setError('Failed to fetch recipe details');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/recipe/edit`, recipe); // Assuming the same endpoint for update
      navigate('/ViewRecipes'); // Adjust the route as necessary
    } catch (err) {
      console.error('Failed to update recipe:', err);
      setError('Failed to update recipe');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container component="main" maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography variant="poster" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'green', marginTop: '60px', marginBottom: '40px' }}>
            Edit Recipe
        </Typography>
        {/* Input fields for recipe details */}
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={recipe.description}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Tags (comma-separated)"
          name="tags"
          value={Array.isArray(recipe.tags) ? recipe.tags.join(', ') : recipe.tags || ''}
          onChange={(e) => setRecipe({...recipe, tags: e.target.value.split(',')})}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Ingredients (comma-separated)"
          name="ingredients"
          value={Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : ''}
          onChange={(e) => setRecipe({...recipe, ingredients: e.target.value.split(',')})}
          margin="normal"
        />
        {/* Add more fields as necessary */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: "green"}}
        >
          Update
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default EditRecipe;
