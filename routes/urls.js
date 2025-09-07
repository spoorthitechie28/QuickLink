const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const Url = require('../models/Url');

// Base URL (change to your domain in production)
const getBaseUrl = () => process.env.BASE_URL || 'http://localhost:3000';

// Render main page
router.get('/', (req, res) => {
    res.render('index', { error: null, url: null, baseUrl: getBaseUrl() });
});

// Handle URL shortening
router.post('/shorten', async (req, res) => {
    let { longUrl, customCode } = req.body;
    let shortCode = customCode ? customCode.trim().toLowerCase() : nanoid(7);

    try {
        // Validate URL
        if (!validUrl.isUri(longUrl)) {
            return res.render('index', { 
                error: 'Invalid URL. Please enter a valid one (e.g., https://example.com)',
                url: null,
                baseUrl: getBaseUrl()
            });
        }

        // Prevent duplicate custom codes
        if (customCode) {
            const existing = await Url.findOne({ shortCode });
            if (existing) {
                return res.render('index', { 
                    error: 'Sorry, that custom name is already taken.',
                    url: null,
                    baseUrl: getBaseUrl()
                });
            }
        }

        // Reuse existing long URL if no custom code
        let url = await Url.findOne({ longUrl });
        if (url && !customCode) {
            return res.render('index', { error: null, url, baseUrl: getBaseUrl() });
        }

        // Create new URL
        const newUrl = new Url({ longUrl, shortCode });
        await newUrl.save();

        res.render('index', { error: null, url: newUrl, baseUrl: getBaseUrl() });

    } catch (err) {
        console.error(err);
        res.status(500).render('404');
    }
});

// Redirect short URL to original long URL
router.get('/:shortCode', async (req, res) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.shortCode });
        if (!url) return res.status(404).render('404');

        // Analytics tracking
        url.clickCount++;
        url.lastAccessed = new Date();
        url.userAgent = req.headers['user-agent'];
        url.lastIp = req.ip;
        await url.save();

        res.redirect(url.longUrl);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
