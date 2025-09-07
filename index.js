require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urls');
const path = require('path');

const app = express();

// Port (Render assigns via env)
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

// Routes
app.use('/', urlRoutes);

// Catch-all 404
app.use((req, res) => {
    res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});
