import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import appError from "../utils/appError.js";
import generateJwt from "../utils/generateJwt.js";
import usersService from "../services/usersService.js";
import httpStatusText from "../utils/httpStatusText.js";
import cartService from "../services/cartService.js";

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await usersService.findAllUsers();
  return res.json({ status: httpStatusText.SUCCESS, data: users });
});

const getUser = asyncWrapper(async (req, res, next) => {
  // Extrcting the user id.
  const { userId } = req.params;

  // Getting the user form the database.
  const user = await usersService.findUser({ user_id: userId });

  // Checking if the uesr exists.
  if (!user) {
    const error = appError.create("User not found", 400, httpStatusText.FAIL);
    return next(error);
  }

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { user } });
});

const createUser = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword, phone, role } =
    req.body;

  // Validating the request body.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  // Checking if the use aleardy registered.
  const userExists = await usersService.findUser({ email });
  if (userExists) {
    const error = appError.create(
      "This user is already registerd",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  // Checking if the the password and confirm password is matched.
  if (!(password === confirmPassword)) {
    const error = appError.create(
      "Password and confirm password do not match.",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  // Hashing the password.
  const hashedPassword = await bcrypt.hashSync(password, 10);

  // Creating the new user and saving it to the database.
  const newUser = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    role: role ? role : "user",
  };

  const newUserId = await usersService.addNewUser(newUser);

  // Generating JWT token.
  const token = await generateJwt({
    userName: newUser.firstName,
    userName: newUser.lastName,
    email: newUser.email,
    id: newUserId,
    role: newUser.role,
  });

  const { password: excludedPassword, ...newUserData } = newUser;

  // Create user cart.
  const userCart = await cartService.createUserCart(newUserId);

  // Returning the user data.
  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { user: newUserData, token: token },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const user = await usersService.findUser({ email }, true);

  if (!user) {
    const error = appError.create(
      "User is not found.",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const matchedPassword = await bcrypt.compareSync(password, user.password);

  if (!matchedPassword) {
    const error = appError.create(
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

export { getAllUsers, getUser, createUser, login };
