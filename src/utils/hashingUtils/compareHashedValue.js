import bcrypt from "bcrypt";

const compareHashedValues = async (value, hashedValue) => {
  const isMatch = await bcrypt.compare(value, hashedValue);
  return isMatch;
};

export default compareHashedValues;
