import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import appError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import wishlistService from "../services/wishlistService.js";
import checkIfUserExists from "../utils/checkIfUserExists.js";
import productsService from "../services/productsService.js";

const getAllWihslist = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const userDoNotExist = await checkIfUserExists(userId);
  if (userDoNotExist) {
    const error = appError.create("Invalid user id", 400, httpStatusText.ERROR);
    return next(error);
  }

  const wishlistItems = await wishlistService.getAllwishlistItems(userId);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { userWishlist: wishlistItems },
  });
});

const addOrRemoveItemToWishlist = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const { productId } = req.body;

  const userDoNotExist = await checkIfUserExists(userId);

  if (userDoNotExist) {
    const error = appError.create("Invalid user id", 400, httpStatusText.ERROR);
    return next(error);
  }

  const validProductId = await productsService.findProduct(productId);
  if (!validProductId) {
    const error = appError.create(
      "Invalid product id",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const productExistsInWishlist = await wishlistService.findWishlistItem({
    userId,
    productId,
  });

  if (productExistsInWishlist) {
    await wishlistService.removeItemFromWishlist({ userId, productId });
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { removedProductId: productId },
    });
  } else {
    await wishlistService.addItemToWishlist({ userId, productId });
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { addedProductId: productId },
    });
  }
});

export { getAllWihslist, addOrRemoveItemToWishlist };
