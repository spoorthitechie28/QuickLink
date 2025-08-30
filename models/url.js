 
const mongoose = require('mongoose');

// This schema defines the structure for the documents
// that we will store in our MongoDB "urls" collection.
const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true,
    },
    shortCode: {
        type: String,
        required: true,
        unique: true, // Every shortCode must be unique
    },
    clickCount: {
        type: Number,
        required: true,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the Mongoose model based on the schema.
// Mongoose will automatically create a collection named "urls" (plural and lowercase).
module.exports = mongoose.model('Url', urlSchema);

