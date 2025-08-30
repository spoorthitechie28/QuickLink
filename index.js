require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urls'); // Import the router for URL shortening
const Url = require('./models/url'); // Import the model to handle redirection

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err));

// 2. Set up Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// 3. Set up Routes
// The homepage route
app.get('/', (req, res) => {
    // Pass local variables so EJS doesn't crash on first load
    res.render('index', { error: null, shortUrl: null });
});

// Use the routes from routes/urls.js for any path starting with /
app.use('/', urlRoutes);

// The redirection route
app.get('/:shortCode', async (req, res) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.shortCode });
        if (url) {
            url.clickCount++;
            await url.save();
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).render('404');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// 4. Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

