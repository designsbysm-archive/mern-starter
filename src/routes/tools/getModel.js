import User from "../../models/User";
import Vehicle from "../../models/Vehicle";

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
