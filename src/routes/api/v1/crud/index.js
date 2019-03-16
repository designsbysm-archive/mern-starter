import express from "express";
import controller from "../../../../controllers/api/v1/crud";
import passport from "passport";
import validateEmptyBody from "../../../../middleware/validateEmptyBody";
import validateModel from "../../../../middleware/validateModel";
import validateRole from "../../../../middleware/validateRole";

const router = express.Router({ mergeParams: true });
const validateJWT = passport.authenticate("jwt");

router
  .route("/")
  .get(validateJWT, validateModel("kind"), controller.readAll)
  .post(validateJWT, validateRole("super"), validateModel("kind"), validateEmptyBody, controller.create);

router.route("/query")
  .post(validateJWT, validateRole("super"), validateModel("kind"), controller.query);

router
  .route("/:id")
  .delete(validateJWT, validateRole("admin"), validateModel("kind"), controller.deleteOne)
  .get(validateJWT, validateModel("kind"), controller.readOne)
  .put(validateJWT, validateRole("super"), validateModel("kind"), validateEmptyBody, controller.update);

export default router;
