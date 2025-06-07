import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import productsService from "../services/productsService.js";
import imagesService from "../services/imagesService.js";

const getAllProducts = asyncWrapper(async (req, res, next) => {
  const products = await productsService.findAllProductsService();

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { products } });
});

const getProduct = asyncWrapper(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productsService.findProductService(productId);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { product } });
});

const createProduct = asyncWrapper(async (req, res, next) => {
  const validatedData = req.body;

  const uploadedImage = req.file.path;
  const productImage = await imagesService.addImage(uploadedImage);

  validatedData.productImage = productImage;

  const product = await productsService.createProductService(validatedData);

  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { product },
  });
});

const updateProduct = asyncWrapper(async (req, res, next) => {
  const { productId } = req.params;
  const validatedData = req.body;

  if (!Object.keys(validatedData).length) {
    const error = new AppError(
      "No fields to update provided",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  if (req.file) {
    const newProductImage = await imagesService.addImage(req.file.path);
    validatedData.productImage = newProductImage;
  }

  const updatedProduct = await productsService.updateProduct(
    productId,
    validatedData
  );

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { updatedProduct } });
});

const deleteProduct = asyncWrapper(async (req, res, next) => {
  const { productId } = req.params;

  const findProductAndDelete = await productsService.deleteProduct(productId);

  if (!findProductAndDelete) {
    const error = new AppError("Invalid Product id", 400, httpStatusText.FAIL);
    return next(error);
  }

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
