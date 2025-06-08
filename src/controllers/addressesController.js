import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import httpStatusText from "../utils/httpStatusText.js";
import addressesService from "../services/addressesService.js";

const getUserAddresses = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;

  const addresses = await addressesService.findUserAddresses(userId);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { addresses } });
});

const createAddress = asyncWrapper(async (req, res, next) => {
  const validatedData = req.body;

  await addressesService.createAddressService(validatedData);

  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { createdAddress: validatedData },
  });
});

export { getUserAddresses, createAddress };
