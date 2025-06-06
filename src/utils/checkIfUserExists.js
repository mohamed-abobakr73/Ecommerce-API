import userServices from "../services/usersService.js";
import AppError from "./AppError.js";
import httpStatusText from "./httpStatusText.js";

const checkIfUserExists = async (userId) => {
  const user = await userServices.findUser({ user_id: userId });
  if (!user) {
    const error = new AppError("Invalid user id", 400, httpStatusText.ERROR);
    return error;
  }
};

export default checkIfUserExists;
