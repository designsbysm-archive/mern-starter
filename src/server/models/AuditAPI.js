const db = require('../mongo');
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    body: {
        type: String,
    },
    code: {
        type: Number,
    },
    method: {
        type: String,
    },
    timestamp: {
        default: Date.now,
        type: Date,
    },
    url: {
        type: String,
    },
    username: {
        type: String,
    },
});

module.exports = db.model('AuditAPI', schema);
