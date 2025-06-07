import { asyncWrapper } from "../middlewares/index.js";
import usersService from "../services/usersService.js";
import httpStatusText from "../utils/httpStatusText.js";

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

  const token = await usersService.registerUserService(validatedData);
  console.log(validatedData);
  // Create user cart.
  // const userCart = await cartService.createUserCart(user.id);

  const createdUser = {
    firstName: validatedData.firstName,
    lastName: validatedData.lastName,
    email: validatedData.email,
    phone: validatedData.phone,
  };

  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { user: createdUser, token: token },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const { user, token } = await usersService.loginService(email, password);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { user, token } });
});

export { getAllUsers, findUser, createUser, login };
