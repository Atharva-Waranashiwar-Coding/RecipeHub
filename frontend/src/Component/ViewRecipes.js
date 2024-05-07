import React, { useEffect, useState } from 'react';
import {
  Typography,
  Fade,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
} from '@mui/material';
import axios from 'axios';

const ViewRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    document.body.style.backgroundColor = '#b39ddb';
    return () => {
        document.body.style.backgroundColor = '';
    };
}, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/recipe/creatorId/${userId}`);
        console.log(response.data);
        setRecipes(response.data);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecipes();
    }
  }, [userId]);

  const handleOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
      return 4.2; // Default rating if no ratings are available
    }
  
    const total = ratings.reduce((acc, curr) => acc + curr, 0);
    if (total === 0) {
      return 4.2; // Default rating if the total is zero
    }
  
    return (total / ratings.length).toFixed(1); // One decimal place
  };

  return (
    <Fade in={true} timeout={2000}>
      <Box textAlign="center" sx={{ mt: 8, mb: 5, ml: 4, mr: 4, minHeight: '100vh' }}>
        <Typography variant="poster" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'white', marginTop: '30px', marginBottom: '40px' }}>
            Your Recipes
        </Typography>
        {loading ? (
          <CircularProgress color="inherit" />
        ) : error ? (
          <Typography variant="h6" color="error" sx={{ my: 5 }}>
            {error}
          </Typography>
        ) : recipes.length > 0 ? (
          <Grid container spacing={2} justifyContent="center">
            {recipes.map((recipe) => (
              <Grid item xs={12} md={6} lg={4} key={recipe._id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <CardContent>
                    <CardMedia
                      component="img"
                      height="150"
                      image={`http://localhost:5000/recipe/images/${recipe.creatorId}/${recipe.imagePath}`}
                      alt={recipe.name}
                    />
                    <Typography gutterBottom variant="h5" component="div">
                      {recipe.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ingredients: {recipe.ingredients.join(', ')}
                    </Typography>
                  </CardContent>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button size="small" color="primary" onClick={() => handleOpen(recipe)}>
                    Show More
                  </Button>
                  <Box sx={{ bgcolor: 'purple', p: 1 }}>
                    <Typography variant="body2" color="white">
                      Rating: {calculateAverageRating(recipe.ratings)}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h4" sx={{ my: 5 }}>
            No Recipes Found
          </Typography>
        )}
        {selectedRecipe && (
          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{selectedRecipe.name}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Typography gutterBottom>Ingredients: {selectedRecipe.ingredients.join(', ')}</Typography>
                <Typography gutterBottom>Description: {selectedRecipe.description}</Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Fade>
  );
};

export default ViewRecipes;



