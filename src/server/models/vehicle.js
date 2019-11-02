import db from "../mongo";
import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

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

export default db.model("Vehicle", schema);
