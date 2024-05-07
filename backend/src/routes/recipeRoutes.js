const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = `images/`;
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only JPG, JPEG, PNG, and GIF files are allowed'));
        }
        cb(null, true);
    }
});

async function getNextRecipeId() {
  try {
    const highestRecipe = await Recipe.findOne({}, {}, { sort: { 'recipeId': -1 } }); // Find the user with the highest userId
    if (highestRecipe) {
      return highestRecipe.recipeId + 1; // Increment the highest userId by 1
    } else {
      return 1; // If no user exists, start from 1
    }
  } catch (err) {
    console.error('Error getting next recipeId:', err);
    throw err;
  }
}

router.post('/create', upload.single('image'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ message: 'No image uploaded' });
      }
      const { name, description, creatorId, tags, ingredients } = req.body;
      const imagePath = req.file.path;
      const recipeId = await getNextRecipeId();

      const uploadPath = `images/${creatorId}/`;
      fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory if it doesn't exist
      fs.renameSync(imagePath, `${uploadPath}${req.file.filename}`); // Move the uploaded file to the new directory

      // Create a new Recipe
      const newRecipe = new Recipe({
          recipeId,
          name,
          description,
          creatorId,
          tags,
          ingredients,
          imagePath: `${req.file.filename}`
      });

      await newRecipe.save();

      res.status(201).json({ message: 'Recipe created successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


// Update Recipe details
router.put('/edit', async (req, res) => {
  try {
    const {name, description, tags, ingredients,recipeId } = req.body;
    // Ensure recipe exists in the database
    const existingRecipe = await Recipe.findOne({ recipeId });
    if (!existingRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Update recipe details
    existingRecipe.name = name;
    existingRecipe.description = description;
    existingRecipe.tags = tags;
    existingRecipe.ingredients = ingredients;
    await existingRecipe.save();

    res.status(200).json({ message: 'Recipe details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/addRating/:recipeId', async(req, res) => {
    try{
      const recipeId = parseInt(req.params.recipeId);
      const { rating } = req.body;

      // Find the recipe with the provided recipeId
      const recipe = await Recipe.findOne({ recipeId });

      // If the recipe is not found, return an error
      if (! recipe) {
          return res.status(404).json({ message: 'Recipe not found' });
      }

      // Update the rating of the recipe
      recipe.ratings.push(parseInt(rating));
      await recipe.save();
      // Return the updated recipe
      res.json({ message: 'Rating added successfully', recipe });
    }catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/delete', async (req, res) => {
    const { recipeId } = req.body;

    try {
      const deletedRecipe = await Recipe.deleteOne({ recipeId });
      if (deletedRecipe.deletedCount === 1) {
        res.status(200).json({ message: 'Recipe deleted successfully' });
      } else {
        res.status(404).json({ error: 'Recipe not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Retrieve all recipes
router.get('/getAll', async (req, res) => {
  try {
    const recipes = await Recipe.find({}, 'name description imagePath creatorId recipeId ratings tags ingredients'); // Fetch only fullName and email fields
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Retrieve recipe by ID 
router.get('/recipeId/:id', async (req, res) => {
  try {
    const recipeId = req.params.id; // Get the user ID from the request parameters
    const recipe = await Recipe.findOne({ recipeId }, 'name description imagePath creatorId recipeId ratings tags ingredients'); // Find the user by ID and fetch fullName and email fields
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Retrieve recipes by creator ID
router.get('/creatorId/:userId', async (req, res) => {
  try {
    const creatorId = req.params.userId; // Get the user ID from the request parameters
    const recipes = await Recipe.find({ creatorId }); // Find recipes by creatorId
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: 'Recipes not found for this user' });
    }
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Retrieve recipes by tag words
router.post('/recipesByTags', async (req, res) => {
  try {
    const { tags } = req.body; // Get the array of tag words from the request body
    const recipes = await Recipe.find({ tags: { $in: tags } }); // Find recipes where tags match any of the provided tag words
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found for the provided tags' });
    }
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Retrieve recipes by ingredient names
router.post('/recipesByIngredients', async (req, res) => {
  try {
    const { ingredients } = req.body; // Get the array of ingredient names from the request body
    const recipes = await Recipe.find({ ingredients: { $in: ingredients } }); // Find recipes where ingredients match any of the provided ingredient names
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found for the provided ingredients' });
    }
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function getAverage(numbers) {
  // Calculate the sum of all numbers in the array
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  
  // Calculate the average by dividing the sum by the number of elements in the array
  const average = sum / numbers.length;
  
  return average;
}


router.get('/recipesByRating/:minRating', async (req, res) => {
  try {
    const minRating = parseFloat(req.params.minRating); // Get the minimum rating value from the request parameters

    const recipes = await Recipe.find({},"name description imagePath creatorId recipeId ratings tags ingredients");
    const returnRecipes=[];

    recipes.forEach(recipe => {
      const average = getAverage(recipe.ratings);
      if(average>=minRating){
        returnRecipes.push(recipe)
      }
    });
    res.status(200).json(returnRecipes);
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//New Addition
// Define a route to handle saving user ratings for recipes
router.put('/rate/:recipeId', async (req, res) => {
    try {
        const recipeId = req.params.recipeId;
        const { rating } = req.body;

        // Find the recipe by ID
        const recipe = await Recipe.findOne({ recipeId });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Add the user's rating to the recipe
        if (!recipe.ratings) {
            recipe.ratings = [rating];
        } else {
            recipe.ratings.push(rating);
        }

        // Save the updated recipe
        await recipe.save();

        res.status(200).json({ message: 'Rating saved successfully' });
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.use('/images/:creatorId', (req, res, next) => {
  // Extract the creatorId from the request parameters
  const creatorId = req.params.creatorId;
  
  // Construct the directory path based on the creator
  const imagePath = path.join(__dirname, '..', '..', 'images', creatorId);
  
  // Serve static files from the constructed directory path
  express.static(imagePath)(req, res, next);
});



module.exports = router;

