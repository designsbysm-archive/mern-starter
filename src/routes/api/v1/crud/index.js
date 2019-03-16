import express from "express";
import controller from "../../../../controllers/api/v1/crud";
import passport from "passport";
import validateEmptyBody from "../../../../middleware/validateEmptyBody";
import validateModel from "../../../../middleware/validateModel";
import validateRole from "../../../../middleware/validateRole";

const router = express.Router({ mergeParams: true });
const validateJWT = passport.authenticate("jwt");

router.get("/", validateJWT, validateModel("kind"), controller.readAll);
router.post("/", validateJWT, validateRole("super"), validateModel("kind"), validateEmptyBody, controller.create);
router.post("/query", validateJWT, validateRole("super"), validateModel("kind"), controller.query);
router.delete("/:id", validateJWT, validateRole("admin"), validateModel("kind"), controller.deleteOne);
router.get("/:id", validateJWT, validateModel("kind"), controller.readOne);
router.put("/:id", validateJWT, validateRole("super"), validateModel("kind"), validateEmptyBody, controller.update);

export default router;
