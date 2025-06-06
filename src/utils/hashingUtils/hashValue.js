import bcrypt from "bcrypt";
const hashKey = async (element) => {
  const hash = await bcrypt.hash(element, 10);
  return hash;
};

export default hashKey;
