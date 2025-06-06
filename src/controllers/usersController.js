import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { asyncWrapper } from "../middlewares/index.js";
import AppError from "../utils/AppError.js";
import { generateJwt } from "../utils/jwtUtils/index.js";
import usersService from "../services/usersService.js";
import httpStatusText from "../utils/httpStatusText.js";
import cartService from "../services/cartService.js";

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await usersService.findAllUsers();
  return res.json({ status: httpStatusText.SUCCESS, data: users });
});

const findUser = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;

  const user = await usersService.findUserService({ user_id: userId });

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { user } });
});

const createUser = asyncWrapper(async (req, res, next) => {
  const validatedData = req.body;

  const { user, token } = await usersService.addNewUser(validatedData);

  // Create user cart.
  const userCart = await cartService.createUserCart(user.id);

  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { user, token: token },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new AppError(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const user = await usersService.findUser({ email }, true);

  if (!user) {
    const error = new AppError("User is not found.", 400, httpStatusText.FAIL);
    return next(error);
  }

  const matchedPassword = await bcrypt.compareSync(password, user.password);

  if (!matchedPassword) {
    const error = new AppError(
      "Wrong password, please try again.",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const userData = {
    userName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    id: user.user_id,
    role: user.role,
  };

  const token = await generateJwt(userData);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { user: userData, token } });
});

export { getAllUsers, findUser, createUser, login };
