import { Router } from "express";
import {
  getAllUsers,
  findUser,
  createUser,
  login,
} from "../controllers/usersController.js";
import {
  registerUserValidation,
  loginValidation,
  verifyToken,
  isAllowed,
  validateRequestBody,
} from "../middlewares/index.js";

import usersRoles from "../utils/usersRoles.js";

const usersRouter = Router();

usersRouter
  .route("/")
  .get(verifyToken, isAllowed(usersRoles.ADMIN), getAllUsers);

usersRouter.route("/:userId").get(findUser);

usersRouter
  .route("/register")
  .post(registerUserValidation(), validateRequestBody, createUser);

usersRouter.route("/login").post(loginValidation(), validateRequestBody, login);

export default usersRouter;
