import controller from "./controller";
import crudController from "../crud/controller";
import express from "express";
import passport from "passport";
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
  .post(validateJWT, validateRole("admin"), validateEmptyBody, controller.create);

router.route("/current")
  .get(validateJWT, controller.current);

router
  .route("/:id")
  .get(validateJWT, validateRole("admin"), addKind, crudController.readOne)
  .put(validateJWT, validateRole("admin"), validateEmptyBody, controller.update);

export default router;
