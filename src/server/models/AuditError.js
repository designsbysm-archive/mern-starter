const db = require('../mongo');
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    code: {
        type: Number,
    },
    message: {
        type: String,
    },
    status: {
        type: String,
    },
    timestamp: {
        default: Date.now,
        type: Date,
    },
});

module.exports = db.model('AuditError', schema);
