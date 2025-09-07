const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    clickCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    lastAccessed: { type: Date },
    userAgent: { type: String },
    lastIp: { type: String }
});

module.exports = mongoose.model('Url', urlSchema);
