import "dotenv/config";
import bluebird from "bluebird";
import mongoose from "mongoose";

if (!process.env.MONGO_CONNECTION) {
  console.error("Error: .env missing mongo config, exiting");
  process.exit(1);
}

mongoose.Promise = bluebird.Promise;
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
});

export default mongoose;
