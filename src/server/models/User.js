const db = require('../mongo');
const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const schema = mongoose.Schema({
    password: {
        required: true,
        select: false,
        type: String,
    },
    role: {
        required: true,
        type: String,
    },
    username: {
        required: true,
        type: String,
        unique: true,
    },
});

schema.plugin(timestamps);
module.exports = db.model('User', schema);
