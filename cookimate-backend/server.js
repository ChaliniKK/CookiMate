// 1. Import necessary tools
require('dotenv').config(); // Loads your .env variables
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the DB connection logic
// const recipeRoutes = require('./routes/recipeRoutes'); // Import the recipe "waiter"

// 2. Initialize the app
const app = express();

// 3. Connect to MongoDB
connectDB();

// 4. Middleware
app.use(cors()); // Allows your React Native app to talk to this server
app.use(express.json()); // Allows the server to understand JSON data sent in a request

// 5. Define Routes
// Add your relevant routes here (example: // app.use('/api/recipes', recipeRoutes);

// 6. Basic Health Check (To see if the server is alive)
app.get('/', (req, res) => {
  res.send('Cookimate Server is Running...');
});

// 7. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is flying on http://localhost:${PORT}`);
});