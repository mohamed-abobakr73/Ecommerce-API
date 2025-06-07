import bcrypt from "bcrypt";
import AppError from "../AppError.js";

const compareHashedValues = async (
  value,
  hashedValue,
  message = "Error comparing values"
) => {
  const isMatch = await bcrypt.compare(value, hashedValue);
  if (!isMatch) {
    const error = new AppError(message, 400, httpStatusText.FAIL);
    throw error;
  }
  return isMatch;
};

export default compareHashedValues;
