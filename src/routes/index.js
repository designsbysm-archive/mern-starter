import express from "express";
import crudController from "./controllers/crud";
import passport from "passport";
import path from "path";
import sessionsController from "./controllers/sessions";
import usersController from "./controllers/users";
import validateEmptyBody from "./middleware/validateEmptyBody";
import validateModel from "./middleware/validateModel";
import validateRole from "./middleware/validateRole";

require("./middleware/passport");
const router = express.Router();
const validateJWT = passport.authenticate("jwt");

// define paths
const apiRoute = "/api";
const v1Route = `${apiRoute}/v1`;
const crudRoute = `${v1Route}/:kind`;
const sessionsRoute = `${v1Route}/sessions`;
const usersRoute = `${v1Route}/users`;

// sessions
router.route(`${sessionsRoute}/login`)
  .post(sessionsController.login);

router.route(`${sessionsRoute}/logout`)
  .post(validateJWT, sessionsController.logout);

router.route(`${sessionsRoute}/saml`)
  .get(sessionsController.saml);

router.route(`${sessionsRoute}/saml/response`)
  .post(sessionsController.samlResponse);

router.route(`${sessionsRoute}/valid`)
  .post(validateJWT, sessionsController.valid);

// users
router.route(usersRoute)
  .post(validateJWT, validateRole("admin"), validateEmptyBody, usersController.create);

router.route(`${usersRoute}/current`)
  .get(validateJWT, usersController.read);

router.route(`${usersRoute}/query`)
  .post(crudController.notAllowed);

router.route(`${usersRoute}/:id`)
  .put(validateJWT, validateRole("admin"), validateEmptyBody, usersController.update);

// crud
router
  .route(crudRoute)
  .post(validateJWT, validateRole("super"), validateModel("kind"), validateEmptyBody, crudController.create)
  .get(validateJWT, validateModel("kind"), crudController.readAll);

router
  .route(`${crudRoute}/query`)
  .post(validateJWT, validateRole("super"), validateModel("kind"), crudController.query);

router
  .route(`${crudRoute}/:id`)
  .get(validateJWT, validateModel("kind"), crudController.readOne)
  .put(validateJWT, validateRole("super"), validateModel("kind"), validateEmptyBody, crudController.update)
  .delete(validateJWT, validateRole("admin"), validateModel("kind"), crudController.deleteOne);

// catch any unhandled /api calls
router.all(`${apiRoute}/*`, crudController.notAllowed);

// index
router.use("/", express.static(path.join(__dirname, "..", "..", "client", "build")));

// static files
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "client", "build", "index.html"));
});

export default router;
