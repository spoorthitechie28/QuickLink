 
const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/url'); // Go up one directory to find the models folder

// An Express router allows us to group related routes into a single file.
const router = express.Router();

// A simple helper function to check if a string is a valid URL.
const isValidUrl = (urlString) => {
    try {
        new URL(urlString);
        return true;
    } catch (err) {
        return false;
    }
};


// @route   GET /
// @desc    Renders the homepage (index.ejs)
router.get('/', (req, res) => {
    // Pass local variables so EJS doesn't crash on the initial page load
    res.render('index', { error: null, shortUrl: null });
});


// @route   POST /shorten
// @desc    Creates a new short URL and shows the result
router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = process.env.BASE_URL || `http://localhost:3000`;

    // Step 1: Validate the URL submitted by the user
    if (!isValidUrl(longUrl)) {
        return res.render('index', { error: 'Please enter a valid URL.', shortUrl: null });
    }

    try {
        // Step 2: Check if the long URL is already in our database
        let url = await Url.findOne({ longUrl });

        if (url) {
            // If it exists, we don't need to create a new one. Just show the existing one.
            res.render('index', {
                shortUrl: `${baseUrl}/${url.shortCode}`,
                error: null
            });
        } else {
            // If it's a new URL, we generate a short code
            const shortCode = nanoid(7);
            const newUrl = new Url({
                longUrl,
                shortCode,
            });
            await newUrl.save(); // Save the new URL record to the database

            // Show the newly created short URL
            res.render('index', {
                shortUrl: `${baseUrl}/${shortCode}`,
                error: null
            });
        }
    } catch (err) {
        console.error(err);
        res.render('index', { error: 'Server error, please try again.', shortUrl: null });
    }
});

// @route   GET /:shortCode
// @desc    Redirects the user from the short URL to the original long URL
router.get('/:shortCode', async (req, res) => {
    try {
        // Find the URL document that matches the short code from the URL parameter
        const url = await Url.findOne({ shortCode: req.params.shortCode });

        if (url) {
            // If we find it, increment the click count and perform the redirect
            url.clickCount++;
            await url.save();
            return res.redirect(url.longUrl);
        } else {
            // If no URL is found, render the 404 page
            return res.status(404).render('404');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// Export the router so it can be used in our main index.js file
module.exports = router;

