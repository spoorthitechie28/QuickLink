require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urls'); // Import the router file

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set up middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// --- MAIN FIX ---
// Tell Express to use the 'urlRoutes' for all incoming requests to the root path '/'
// This replaces the old app.get('/') that was causing the error.
app.use('/', urlRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

