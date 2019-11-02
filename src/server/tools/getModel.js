import User from "../models/user";
import Vehicle from "../models/vehicle";

export default schema => {
  let Model = null;

  switch (schema) {
    case "users":
      Model = User;
      break;

    case "vehicles":
      Model = Vehicle;
      break;
  }

  return Model;
};
