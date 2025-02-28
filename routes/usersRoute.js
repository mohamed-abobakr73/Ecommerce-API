import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  login,
} from "../controllers/usersController.js";
import registerUserValidation from "../middlewares/registerUserValidation.js";
import loginValidation from "../middlewares/loginValidation.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAllowed from "../middlewares/isAllowed.js";
import usersRoles from "../utils/usersRoles.js";

const usersRouter = Router();

usersRouter
  .route("/")
  .get(verifyToken, isAllowed(usersRoles.ADMIN), getAllUsers);

usersRouter.route("/:userId").get(getUser);

usersRouter.route("/register").post(registerUserValidation(), createUser);

usersRouter.route("/login").post(loginValidation(), login);

export default usersRouter;
