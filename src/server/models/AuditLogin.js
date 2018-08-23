const db = require('../mongo');
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    action: {
        required: true,
        type: String,
    },
    date: {
        default: Date.now,
        type: Date,
    },
    username: {
        required: true,
        type: String,
    },
});

module.exports = db.model('AuditLogin', schema);
