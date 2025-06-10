import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import wishlistService from "../services/wishlistService.js";
import checkIfUserExists from "../utils/checkIfUserExists.js";
import productsService from "../services/productsService.js";

const getAllWihslist = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const userDoNotExist = await checkIfUserExists(userId);
  if (userDoNotExist) {
    const error = new AppError("Invalid user id", 400, httpStatusText.ERROR);
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
  const validatedData = req.body;
  const { productId } = validatedData;

  const productExistsInWishlist = await wishlistService.findWishlistItemService(
    {
      userId,
      productId,
    }
  );

  let resData = {};

  if (productExistsInWishlist) {
    await wishlistService.removeItemFromWishlist({ userId, productId });
    resData = { removedProductId: productId };
  } else {
    await wishlistService.addItemToWishlistService({ userId, productId });
    resData = { addedProductId: productId };
  }

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      operation: resData.addedProductId
        ? {
            addedProductId: resData.addedProductId,
            msg: "Product added to wishlist",
          }
        : {
            removedProductId: resData.removedProductId,
            msg: "Product removed from wishlist",
          },
    },
  });
});

export { getAllWihslist, addOrRemoveItemToWishlist };
