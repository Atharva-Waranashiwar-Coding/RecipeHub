const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const jwt = require('jsonwebtoken');
const router = express.Router();
const axios = require('axios');
const { sendEmail } = require('../services/emailService');
const { chefMessage } = require('../services/chefMail');
const { userMessage } = require('../services/userMail');

// Data Validation Middleware
const validateUserData = [
  body('email').isEmail(),
  body('fullName').isLength({ min: 1 }),
  body('password').isStrongPassword(),
  body('role').isLength({ min: 1 }),
];


async function getNextUserId() {
  try {
    const highestUser = await User.findOne({}, {}, { sort: { 'userId': -1 } }); // Find the user with the highest userId
    if (highestUser) {
      return highestUser.userId + 1; // Increment the highest userId by 1
    } else {
      return 1; // If no user exists, start from 1
    }
  } catch (err) {
    console.error('Error getting next userId:', err);
    throw err;
  }
}

// Create a new user
router.post('/create', validateUserData, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await getNextUserId();
    // Create a new user
    const newUser = new User({
      userId,
      fullName,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    // Send email alert
    if(role == 'chef'){
      await sendEmail(email, 'Welcome to RecipeHub! 🍳🌟',chefMessage );
    }
    else{
      await sendEmail(email, 'Welcome to RecipeHub! 🍳🌟',userMessage );
    }
    

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user details
router.put('/edit', async (req, res) => {
  try {
    const {email, fullName, password } = req.body;

    // Validate full name and password
    if (!fullName || !password) {
      return res.status(400).json({ message: 'Full name and password are required' });
    }

    // Ensure user exists in the database
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    existingUser.fullName = fullName;
    existingUser.password = await bcrypt.hash(password, 10); // Hash the new password
    await existingUser.save();

    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user by email
router.delete('/delete', async (req, res) => {
    const { email } = req.body;

    try {
      const deletedUser = await User.deleteOne({ email });
      if (deletedUser.deletedCount === 1) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});



// Retrieve all users
router.get('/getAllUsers', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }, 'fullName email savedRecipes role').lean();
    if (!users) {
      // No users found
      return res.status(404).json({ message: 'No users found' });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//Get All Chefs
router.get('/getAllChefs', async (req, res) => {
  try {
    const users = await User.find({ role: 'chef' }, 'fullName email savedRecipes role userId').lean();

    // Map each user to a promise that fetches their recipes
    const promises = users.map(async user => {
      const recipesResponse = await axios.get(`http://localhost:5000/recipe/creatorId/${user.userId}`);
      return { ...user, myRecipe: recipesResponse.data };
    });

    // Wait for all promises to resolve
    const usersWithRecipes = await Promise.all(promises);

    if (usersWithRecipes.length === 0) {
      // No users found
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(usersWithRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Retrieve user by ID 
router.get('/getId/:id', async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the request parameters
    const user = await User.findOne({ userId }, 'userId fullName email'); // Find the user by ID and fetch fullName and email fields
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Retrieve saved recipes by user ID
router.get('/getSavedRecipes/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the request parameters
    const user = await User.findOne({ userId }); // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const savedRecipeIds = user.savedRecipes; // Get the saved recipes array from the user document
    const savedRecipes = await Promise.all(savedRecipeIds.map(async id => {
      const recipe = await Recipe.findOne({ recipeId: id });
      return recipe;
    }));
    res.status(200).json(savedRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Save recipe by user ID
router.post('/saveRecipe/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the request parameters
    const { recipeId } = req.body;

    // Check if the recipe is already saved
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ message: 'Recipe already saved' });
    }

    // Add the recipe to the saved recipes list
    user.savedRecipes.push(recipeId);
    await user.save();

    res.status(200).json({ message: 'Recipe saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// delete recipe by user ID
router.delete('/deleteSavedRecipe/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the request parameters
    const user = await User.findOne({ userId }); // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const {recipeId} = req.body
    user.savedRecipes.splice(user.savedRecipes.indexOf(recipeId),1)
    await user.save();
    res.status(200).json({message:'Recipe removed successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



//login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email }, 'fullName email password role userId');
      if (user) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
              // Generate JWT token
              const token = jwt.sign({ user: user }, 'your_secret_key', { expiresIn: '30m' });
              res.json({ success: true, token });
          } else {
              res.status(401).json({ success: false, message: 'Invalid username or password' });
          }
      } else {
          res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;

