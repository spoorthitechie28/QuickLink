const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const Url = require('../models/url'); // just remove any 'src/' prefix

// Base URL
const getBaseUrl = () => process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

// Home page
router.get('/', (req, res) => {
    res.render('index', { error: null, url: null, baseUrl: getBaseUrl() });
});

// Shorten URL
router.post('/shorten', async (req, res) => {
    let { longUrl, customCode } = req.body;
    let shortCode = customCode ? customCode.trim().toLowerCase() : nanoid(7);

    try {
        if (!validUrl.isUri(longUrl)) {
            return res.render('index', { 
                error: 'Invalid URL',
                url: null,
                baseUrl: getBaseUrl()
            });
        }

        if (customCode) {
            const existing = await Url.findOne({ shortCode });
            if (existing) {
                return res.render('index', { 
                    error: 'Custom name already taken',
                    url: null,
                    baseUrl: getBaseUrl()
                });
            }
        }

        let url = await Url.findOne({ longUrl });
        if (url && !customCode) {
            return res.render('index', { error: null, url, baseUrl: getBaseUrl() });
        }

        const newUrl = new Url({ longUrl, shortCode });
        await newUrl.save();

        res.render('index', { error: null, url: newUrl, baseUrl: getBaseUrl() });

    } catch (err) {
        console.error(err);
        res.status(500).render('404');
    }
});

// Redirect
router.get('/:shortCode', async (req, res) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.shortCode });
        if (!url) return res.status(404).render('404');

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
