import "dotenv/config";
import bluebird from "bluebird";
import mongoose from "mongoose";

mongoose.Promise = bluebird.Promise;
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
});

module.exports = mongoose;
