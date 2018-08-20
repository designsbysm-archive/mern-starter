const db = require('../mongo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

schema.methods.decodeToken = function (header, secret) {
    return jwt.verify(header.replace('Bearer ', ''), secret);
};

schema.methods.generateToken = function (secret) {
    return jwt.sign({
        role: this.role,
        updated: this.updatedAt,
        username: this.username,
    }, secret, { expiresIn: 60 * 60 * 24 });
};

schema.methods.generatePasswordHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

schema.methods.validatePasswordHash = function (password) {
    return bcrypt.compareSync(password, this.password);
};

schema.plugin(timestamps);
module.exports = db.model('User', schema);
