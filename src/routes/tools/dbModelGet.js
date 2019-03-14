import User from "../../models/User";
import Vehicle from "../../models/Vehicle";

export default kind => {
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
};
