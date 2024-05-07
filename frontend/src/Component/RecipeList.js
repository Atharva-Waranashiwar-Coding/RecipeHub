import React, { useState, useEffect } from 'react';
import { Grid, Typography, Chip, IconButton, Avatar, Button, Modal, TextField } from '@mui/material';
import { Card, CardHeader, CardMedia, CardContent, CardActions } from '@mui/material';
import { red } from '@mui/material/colors';
import { MoreVert, Save, Star } from '@mui/icons-material';
import axios from 'axios';
import { FormControl, InputGroup, Collapse } from 'react-bootstrap';
import Rating from '@mui/material/Rating'; // Import Rating component

const RecipeList = () => {
    const [inputValue, setInputValue] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [userId, setUserId] = useState('');
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [rating, setRating] = useState('');
    const [showRatingModal, setShowRatingModal] = useState(false);

    useEffect(() => {
        fetchRecipes();
        fetchUserId();
    }, []);

    useEffect(() => {
        document.body.style.backgroundColor = '#ffb74d';
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/recipe/getAll');
            setRecipes(response.data);
            setFilteredRecipes(response.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const fetchUserId = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('User ID not found in localStorage');
                return;
            }
            const response = await axios.get(`http://localhost:5000/user/getId/${userId}`);
            console.log("Response data:", response.data);
            if (response.data && response.data.userId) {
                setUserId(response.data.userId);
            } else {
                console.error("User ID not found in response");
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    const updateRecentSearches = (newSearch) => {
        if (!recentSearches.includes(newSearch)) {
            const updatedSearches = [newSearch, ...recentSearches].slice(0, 10);
            setRecentSearches(updatedSearches);
        }
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue) {
            performSearch();
        }
    };

    const performSearch = () => {
        const keywordToAdd = inputValue.trim().toLowerCase();
        if (keywordToAdd && !keywords.includes(keywordToAdd)) {
            const newKeywords = [...keywords, keywordToAdd];
            setKeywords(newKeywords);
            filterRecipesWithKeywords(newKeywords);
            updateRecentSearches(keywordToAdd);
        }
        setInputValue('');
    };

    const handleKeywordDelete = (keywordToDelete) => () => {
        const newKeywords = keywords.filter(keyword => keyword !== keywordToDelete);
        setKeywords(newKeywords);
        filterRecipesWithKeywords(newKeywords);
    };

    const filterRecipesWithKeywords = (keywords) => {
        if (keywords.length === 0) {
            setFilteredRecipes(recipes);
        } else {
            const filteredData = recipes.filter(recipe => {
                const isMatch = isRecipeMatch(recipe, keywords);
                return isMatch;
            });
            setFilteredRecipes(filteredData);
        }
    };

    const isRecipeMatch = (recipe, keywords) => {
        const recipeText = `${recipe.name.toLowerCase()} ${recipe.description.toLowerCase()}`;
        return keywords.every(keyword => {
            const match = recipeText.includes(keyword.toLowerCase());
            return match;
        });
    };

    const handleRecentSearchClick = (search) => {
        if (!keywords.includes(search)) {
            const newKeywords = [...keywords, search];
            setKeywords(newKeywords);
            filterRecipesWithKeywords(newKeywords);
            setInputValue('');
        } else {
            const filteredKeywords = keywords.filter(keyword => keyword !== search);
            setKeywords(filteredKeywords);
            filterRecipesWithKeywords(filteredKeywords);
            setInputValue('');
        }
    };

    const handleSaveRecipe = async (recipeId) => {
        try {
            if (!userId) {
                console.error('User ID not available');
                return;
            }
            console.log('Saving recipe for user ID:', userId);
            const response = await axios.post(`http://localhost:5000/user/saveRecipe/${userId}`, { recipeId });
            console.log("Save recipe response:", response.data);
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
    };

    const handleOpenRatingModal = (recipe) => {
        setSelectedRecipe(recipe);
        setShowRatingModal(true);
    };

    const handleCloseRatingModal = () => {
        setSelectedRecipe(null);
        setShowRatingModal(false);
    };

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const handleRateRecipe = async () => {
        try {
            if (!userId || !selectedRecipe) {
                console.error('User ID or selected recipe not available');
                return;
            }
            console.log('Rating recipe for user ID:', userId);
            const response = await axios.put(`http://localhost:5000/recipe/addRating/${selectedRecipe.recipeId}`, { rating });
            console.log("Rate recipe response:", response.data);
            // Refresh recipes after rating
            fetchRecipes();
            handleCloseRatingModal();
        } catch (error) {
            console.error('Error rating recipe:', error);
        }
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
        <Grid container spacing={2} sx={{ padding: '20px' }}>
            <Grid item xs={12}>
                <Typography variant="poster" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'white', marginTop: '30px', marginBottom: '40px' }}>
                    Recipe List
                </Typography>
                <InputGroup className="mb-3" style={{ height: '50px' }}>
                    <FormControl
                        placeholder="Search Keywords"
                        aria-label="Search Keywords"
                        aria-describedby="basic-addon2"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        style={{ borderRadius: '15px 0 0 15px', width: 'calc(100% - 130px)', height: '100%'}}
                    />
                    <Button
                        variant="outline-secondary"
                        id="button-addon2"
                        onClick={performSearch}
                        style={{ backgroundColor: '#009688', color: 'white', borderRadius: '0 15px 15px 0'}}
                    >
                        Search
                    </Button>
                </InputGroup>
                <Typography variant="body2" style={{ marginTop: '10px', marginBottom: '10px', color: 'white' }}>Recent Searches:</Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {recentSearches.map((search, index) => (
                        <Chip
                            key={index}
                            label={search}
                            onClick={() => handleRecentSearchClick(search)}
                            style={{ margin: '5px', backgroundColor: 'white', color: 'black' }}
                        />
                    ))}
                </div>
                <div style={{ margin: '10px 0' }}>
                    {keywords.map((keyword, index) => (
                        <Chip
                            key={index}
                            label={keyword}
                            onDelete={handleKeywordDelete(keyword)}
                            color="primary"
                            style={{ margin: '5px', backgroundColor: '' }}
                        />
                    ))}
                </div>
            </Grid>
            {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} sx={{ marginBottom: 4 }} key={recipe.recipeId}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                        {recipe.name.charAt(0)}
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVert />
                                    </IconButton>
                                }
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
                            <Collapse in={expandedCardId === recipe.recipeId} timeout={300} unmountOnExit>
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
                                <IconButton aria-label="save" onClick={() => handleSaveRecipe(recipe.recipeId)}>
                                    <Save />
                                </IconButton>
                                <Typography h5>
                                        {calculateAverageRating(recipe.ratings)}
                                </Typography>
                                <IconButton aria-label="rate" onClick={() => handleOpenRatingModal(recipe)}>
                                    <Star />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Grid item xs={12}>
                    <Typography variant="body1">No Recipes match your search criteria.</Typography>
                </Grid>
            )}

            {/* Rating Modal */}
            <Modal
                open={showRatingModal}
                onClose={handleCloseRatingModal}
                aria-labelledby="rating-modal-title"
                aria-describedby="rating-modal-description"
            >
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', borderRadius: '10px', padding: '20px' }}>
                    <Typography variant="h5" id="rating-modal-title" gutterBottom>
                        Rate Recipe
                    </Typography>
                    <Rating
                        name="recipe-rating"
                        value={rating}
                        precision={0.5} // Optional: allows half-star ratings
                        onChange={handleRatingChange}
                    />
                    <br></br>
                    <Button variant="contained" onClick={() => handleRateRecipe(rating)} sx={{ marginLeft: '20px' }}>Submit</Button>
                </div>
            </Modal>
        </Grid>
    );
};

export default RecipeList;
