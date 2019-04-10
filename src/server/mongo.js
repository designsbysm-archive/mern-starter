import "dotenv/config";
import { missingConfig } from "./tools/messages";
import bluebird from "bluebird";
import mongoose from "mongoose";

if (!process.env.MONGO_CONNECTION) {
  console.error(missingConfig);
  process.exit(1);
}

mongoose.Promise = bluebird.Promise;
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
});

export default mongoose;
