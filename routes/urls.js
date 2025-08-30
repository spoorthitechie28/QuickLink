const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/url');

const router = express.Router();

// GET / -> Renders the homepage
router.get('/', (req, res) => {
    // THE FIX IS HERE: We must pass `baseUrl` to the template
    res.render('index', { 
        error: null, 
        shortUrl: null,
        baseUrl: process.env.BASE_URL || 'http://localhost:3000' // Pass the base URL
    });
});

// POST /shorten -> Creates a new short link
router.post('/shorten', async (req, res) => {
    const { longUrl, customCode } = req.body;
    let shortCode;

    try {
        if (customCode) {
            const existing = await Url.findOne({ shortCode: customCode });
            if (existing) {
                // If custom name is taken, render the page again with an error
                return res.render('index', {
                    error: 'Sorry, that custom name is already taken.',
                    shortUrl: null,
                    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
                });
            }
            shortCode = customCode;
        } else {
            shortCode = nanoid(7);
        }

        const newUrl = new Url({
            longUrl,
            shortCode
        });

        await newUrl.save();

        res.render('index', {
            error: null,
            shortUrl: `${process.env.BASE_URL}/${shortCode}`,
            baseUrl: process.env.BASE_URL || 'http://localhost:3000'
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET /:shortCode -> Redirects to the long URL
router.get('/:shortCode', async (req, res) => {
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

module.exports = router;

