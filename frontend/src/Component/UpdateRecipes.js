import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid, Card, CardContent, CardMedia, Button, Typography,
  Dialog, DialogActions, DialogTitle, CardActions, Snackbar, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UpdateRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#9575cd';
    return () => {
        document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchRecipes(userId);
    }
  }, []);

  const fetchRecipes = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/recipe/creatorId/${userId}`);
      setRecipes(response.data);
    } catch (err) {
      setError('Failed to fetch recipes.');
      setSnackbarMessage('Failed to fetch recipes.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (recipeId) => {
    navigate(`/editRecipe/${recipeId}`);
    console.log(recipeId);
  };

  const handleDeleteConfirmation = (recipe) => {
    setRecipeToDelete(recipe);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    console.log(recipeToDelete.recipeId)
    if (!recipeToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/recipe/delete`, {
        data: { recipeId: recipeToDelete.recipeId }
      });
      setSnackbarMessage('Recipe deleted successfully.');
      setRecipes(recipes.filter(recipe => recipe.recipeId !== recipeToDelete));
      navigate('/UpdateRecipes');
    } catch (err) {
      setSnackbarMessage('Failed to delete the recipe.');
      console.error(err);
    } finally {
      setDeleteConfirmOpen(false);
      setSnackbarOpen(true);
      const userId = localStorage.getItem('userId');
      if (userId) {
        fetchRecipes(userId); // Ensuring we're refreshing the list from the server
      }
    }
  };

  return (
    <div>
      {loading ? <CircularProgress /> : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="poster" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'white', marginTop: '60px', marginBottom: '40px' }}>
              Manage Recipes
            </Typography>
          </Grid>
          {recipes.map((recipe) => (
            <Grid item key={recipe._id} xs={12} sm={4} md={4} sx={{ mb: 5, ml: 4, mr: 4 }}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={`http://localhost:5000/recipe/images/${recipe.creatorId}/${recipe.imagePath}`}
                  alt={recipe.name}
                />
                <CardContent>
                <Typography variant="h5" sx={{ textAlign: 'center', color: 'purple' }}>{recipe.name}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', width: '100%' }}>
                  <Button size="small" onClick={() => handleEdit(recipe.recipeId)}>Edit</Button>
                  <div style={{ width: '50px' }} />
                  <Button size="small" onClick={() => handleDeleteConfirmation(recipe)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>{"Are you sure you want to delete this recipe?"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="primary" autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default UpdateRecipes;




