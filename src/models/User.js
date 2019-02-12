import bcrypt from "bcrypt";
import { environment } from "../config";
import db from "../mongo";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

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
  ].includes(environment)) {
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

export default db.model("User", schema);
