const mongoose = require("mongoose");
const dotenv = require("dotenv");

// load .env variables
dotenv.config();

// setup mongoose
mongoose.Promise = require("bluebird").Promise;
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
});

module.exports = mongoose;
