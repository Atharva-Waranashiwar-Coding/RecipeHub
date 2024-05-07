import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Box, Typography, Pagination } from '@mui/material';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1); // State to manage current page

  const recipesPerPage = 5; // Number of recipes per page

  useEffect(() => {
    // Fetch recipes for the current page when the page changes
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipe/getAll`);
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('An unexpected error occurred');
      }
    };

    fetchRecipes();
  }, [page]); // Fetch recipes when page changes

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await axios.delete('http://localhost:5000/recipe/delete', {
        data: { recipeId } // Pass recipeId in the request body
      });
      if (response.status === 200) {
        // Update the recipes state after deleting the recipe
        setRecipes(recipes.filter(recipe => recipe.recipeId !== recipeId));
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setError('An unexpected error occurred');
    }
  };

  const indexOfLastPost = page * recipesPerPage;
  const indexOfFirstPost = indexOfLastPost - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (event, value) => {
    setPage(value); // Update page state when page changes
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
    <Box className="container" display="flex" flexDirection="column" justifyContent="top !important" height="100vh" marginTop='50px'>
      <Typography variant="poster" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'green', marginTop: '30px', marginBottom: '30px' }}>
          Recipes List
      </Typography>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Ratings</TableCell>
            <TableCell>Action</TableCell> {/* Add column for delete button */}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentRecipes.map(recipe => (
            <TableRow key={recipe.recipeId}>
              <TableCell>{recipe.name}</TableCell>
              <TableCell>{recipe.tags}</TableCell>
              <TableCell>{calculateAverageRating(recipe.ratings)}</TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={() => handleDeleteRecipe(recipe.recipeId)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        count={Math.ceil(recipes.length / recipesPerPage)} // Total number of pages
        page={page} // Current page
        onChange={handlePageChange} // Function to handle page change
        color="primary"
        size="large"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
    </Box>
  );
};

export default RecipesPage;
