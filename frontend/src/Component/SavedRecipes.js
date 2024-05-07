import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Collapse } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const SavedRecipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [userId, setUserId] = useState('');
    const [expandedCardId, setExpandedCardId] = useState(null);

    useEffect(() => {
        document.body.style.backgroundColor = '#ffd54f';
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    useEffect(() => {
        // Fetch the user ID from localStorage
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);

        if (storedUserId) {
            // If user ID is available, fetch saved recipes
            fetchSavedRecipes(storedUserId);
        }
    }, []);

    const fetchSavedRecipes = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/user/getSavedRecipes/${userId}`);
            setSavedRecipes(response.data);
        } catch (error) {
            console.error('Error fetching saved recipes:', error);
        }
    };

    const handleDeleteRecipe = async (recipeId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/user/deleteSavedRecipe/${userId}`, {
                data: { recipeId } // Send recipeId in the request body
            });
            console.log(response.data.message);
            // After successful deletion, fetch updated list of saved recipes
            fetchSavedRecipes(userId);
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    return (
        <Grid container spacing={2} sx={{ padding: '20px' }}>
            <Grid item xs={12}>
                <Typography variant="poster" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'white', marginTop: '30px', marginBottom: '40px' }}>
                    Saved Recipes
                </Typography>
            </Grid>
            {savedRecipes.length > 0 ? (
                savedRecipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe.recipeId}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardHeader
                                title={recipe.name}
                                subheader={`Recipe ID: ${recipe.recipeId}`}
                            />
                            <CardMedia
                                component="img"
                                height="194"
                                image={`http://localhost:5000/recipe/images/${recipe.creatorId}/${recipe.imagePath}`}
                                alt={recipe.name}
                                onClick={() => setExpandedCardId(expandedCardId === recipe.recipeId ? null : recipe.recipeId)}
                                style={{ cursor: 'pointer' }}              
                            />
                            <Collapse in={expandedCardId === recipe.recipeId} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        {recipe.description}
                                    </Typography>
                                    <Typography paragraph>Ingredients:</Typography>
                                    <ul>
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Collapse>
                            <CardActions disableSpacing>
                                <IconButton aria-label="delete" onClick={() => handleDeleteRecipe(recipe.recipeId)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Grid item xs={12}>
                    <Typography variant="body1">No saved recipes yet.</Typography>
                </Grid>
            )}
        </Grid>
    );
};

export default SavedRecipes;





