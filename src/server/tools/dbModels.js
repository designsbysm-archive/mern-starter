const User = require("../models/User");
const Vehicle = require("../models/Vehicle");

module.exports = {
  getModel: kind => {
    let model = null;

    switch (kind) {
      case "users":
        model = User;
        break;

      case "vehicles":
        model = Vehicle;
        break;
    }

    if (!model) {
      throw new Error(`model not found: ${kind}`);
    }

    return model;
  },
};
