const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require("path");
const userRoutes = require(path.join(__dirname,'routes','userRoutes'));
const recipeRoutes = require(path.join(__dirname,'routes','recipeRoutes'));
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch(err => console.error(err));

// Routes
app.use('/user', userRoutes);
app.use('/recipe',recipeRoutes);

app.use('/images', express.static(path.join(__dirname,'..','images'))); // added for images

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

