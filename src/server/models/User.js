const bcrypt = require("bcrypt");
const config = require("../config");
const db = require("../mongo");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const schema = mongoose.Schema({
  active: {
    default: true,
    type: Boolean,
  },
  lastLogin: {
    type: Date,
  },
  name: {
    first: {
      type: String,
    },
    last: {
      type: String,
    },
  },
  password: {
    select: false,
    type: String,
  },
  role: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
    unique: true,
  },
});

schema.methods.decodeToken = function(header, secret) {
  return jwt.verify(header.replace("Bearer ", ""), secret);
};

schema.methods.generateToken = function(secret) {
  let seconds = 12 * 60 * 60;
  if ([
    "development",
    "debug", 
  ].includes(config.environment)) {
    // one year
    seconds = 365 * 24 * 60 * 60;
  }
  const timestamp = Math.floor(Date.now() / 1000) + seconds;

  return {
    expires: timestamp,
    token: jwt.sign(
      {
        exp: timestamp,
        id: this._id,
        updated: this.updatedAt,
      },
      secret,
    ),
  };
};

schema.methods.generatePasswordHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

schema.methods.validatePasswordHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};

schema.plugin(timestamps);
module.exports = db.model("User", schema);
