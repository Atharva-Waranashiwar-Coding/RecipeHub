const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  recipeId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  creatorId: {
    type: Number,
    required: true
  },
  ratings: {
    type: Array,
    required: false
  },
  tags: {
    type: Array,
    required: false
  }
});

// Define a pre-save middleware to generate the userId
recipeSchema.pre('save', async function(next) {
  try {
    // Check if userId already exists
    if (!this.recipeId) {
      // If userId doesn't exist, generate a new one
      const highestRecipe = await mongoose.model('Recipe').findOne({}, {}, { sort: { 'recipeId': -1 } });
      this.recipeId = highestRecipe ? highestRecipe.recipeId + 1 : 1;
    }
    next();
  } catch (err) {
    console.error('Error generating recipeId:', err);
    next(err);
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
