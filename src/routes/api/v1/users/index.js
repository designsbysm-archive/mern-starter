import crudController from "../../../../controllers/api/v1/crud";
import express from "express";
import passport from "passport";
import userController from "../../../../controllers/api/v1/users";
import validateEmptyBody from "../../../../middleware/validateEmptyBody";
import validateRole from "../../../../middleware/validateRole";

const router = express.Router({ mergeParams: true });
const validateJWT = passport.authenticate("jwt");

router.get("/", validateJWT, validateRole("admin"), crudController.readAll);
router.post("/", validateJWT, validateRole("admin"), validateEmptyBody, userController.create);
router.get("/current", validateJWT, userController.read);
router.get("/:id", validateJWT, validateRole("admin"), crudController.readOne);
router.put("/:id", validateJWT, validateRole("admin"), validateEmptyBody, userController.update);

export default router;
