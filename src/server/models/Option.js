import db from "../mongo";
import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const schema = mongoose.Schema({
  key: {
    required: true,
    type: String,
    unique: true,
  },
  metadata: {
    type: Object,
  },
});

schema.plugin(timestamps);

export default db.model("Option", schema);
