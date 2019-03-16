import express from "express";
import passport from "passport";
import controller from "../../../../controllers/api/v1/sessions";

const router = express.Router();
const validateJWT = passport.authenticate("jwt");

router.post("/login", controller.login);
router.post("/logout", validateJWT, controller.logout);
router.get("/saml", controller.saml);
router.post("/saml/response", controller.samlResponse);
router.post("/valid", validateJWT, controller.valid);

export default router;
