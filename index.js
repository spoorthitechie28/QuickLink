require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urls'); // use plural 'urls'

const app = express();

// ✅ Use PORT from .env, fallback to 5000 if not set
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set up middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Use router for all root requests
app.use('/', urlRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});
