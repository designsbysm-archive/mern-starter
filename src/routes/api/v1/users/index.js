import crudController from "../../../../controllers/api/v1/crud";
import express from "express";
import passport from "passport";
import usersController from "../../../../controllers/api/v1/users";
import validateEmptyBody from "../../../../middleware/validateEmptyBody";
import validateRole from "../../../../middleware/validateRole";

const router = express.Router({ mergeParams: true });
const validateJWT = passport.authenticate("jwt");
const addKind = (req, res, next) => {
  req.params.kind = "users";
  next();
};

router
  .route("/")
  .get(validateJWT, validateRole("admin"), addKind, crudController.readAll)
  .post(validateJWT, validateRole("admin"), validateEmptyBody, usersController.create);

router.route("/current")
  .get(validateJWT, usersController.current);

router
  .route("/:id")
  .get(validateJWT, validateRole("admin"), addKind, crudController.readOne)
  .put(validateJWT, validateRole("admin"), validateEmptyBody, usersController.update);

export default router;
