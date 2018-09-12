const db = require('../mongo');
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    action: {
        type: String,
    },
    method: {
        type: String,
    },
    timestamp: {
        default: Date.now,
        type: Date,
    },
    username: {
        type: String,
    },
});

module.exports = db.model('AuditAuthentication', schema);
