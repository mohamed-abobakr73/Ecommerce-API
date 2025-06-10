import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import httpStatusText from "../utils/httpStatusText.js";
import wishlistService from "../services/wishlistService.js";

const getAllWishlist = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;

  const wishlistItems = await wishlistService.getAllWishlistItemsService(
    userId
  );

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
    await wishlistService.addOrRemoveItemToWishlistService("remove", {
      userId,
      productId,
    });
    resData = { removedProductId: productId };
  } else {
    await wishlistService.addOrRemoveItemToWishlistService("add", {
      userId,
      productId,
    });
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

export { getAllWishlist, addOrRemoveItemToWishlist };
