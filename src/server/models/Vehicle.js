const db = require("../mongo");
const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const schema = mongoose.Schema({
  make: {
    required: true,
    type: String,
  },
  model: {
    required: true,
    type: String,
  },
  year: {
    required: true,
    type: Number,
  },
});

schema.plugin(timestamps);
module.exports = db.model("Vehicle", schema);
