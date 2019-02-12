import "dotenv/config";
import mongoose from "mongoose";

mongoose.Promise = require("bluebird").Promise;
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
});

module.exports = mongoose;
