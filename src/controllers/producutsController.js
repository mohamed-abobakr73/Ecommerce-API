import { validationResult } from "express-validator";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import AppError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import productsService from "../services/productsService.js";
import usersService from "../services/usersService.js";
import categoriesService from "../services/categoriesService.js";
import brandsService from "../services/brandsService.js";
import imagesService from "../services/imagesService.js";

const getAllProducts = asyncWrapper(async (req, res, next) => {
  const products = await productsService.findAllProducts();
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { products } });
});

const getProduct = asyncWrapper(async (req, res, next) => {
  const { productId } = req.params;
  const productData = await productsService.findProduct(productId);

  if (!productData) {
    const error = new AppError("Product not found", 400, httpStatusText.FAIL);
    return next(error);
  }
  const { sellerId } = productData;
  const productSeller = await usersService.findUser({
    user_id: +sellerId,
  });

  const product = { ...productData, seller: productSeller };

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { product } });
});

const createProduct = asyncWrapper(async (req, res, next) => {
  const {
    productName,
    productDescription,
    price,
    stockQuantity,
    sellerId,
    category,
    brand,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new AppError(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const uploadedImage = req.file.path;

  const productImage = await imagesService.addImage(uploadedImage);

  const newProductId = await productsService.addNewProduct({
    productData: req.body,
    productImage,
  });

  if (!newProductId) {
    const error = new AppError(
      "Failed to create product, please try again",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const productSeller = await usersService.findUser({ user_id: sellerId });

  const productCategory = await categoriesService.findCategory(+category);

  const productBrand = await brandsService.findBrand(+brand);

  const newProductData = {
    id: newProductId,
    productName,
    productDescription,
    price,
    stockQuantity,
    category: productCategory,
    brand: productBrand,
    productImage: uploadedImage,
    createdBy: { ...productSeller },
  };

  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { newProduct: newProductData },
  });
});

const updateProduct = asyncWrapper(async (req, res, next) => {
  const { productId } = req.params;

  if (!Object.keys(req.body).length) {
    const error = new AppError(
      "No fields to update provided",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  if (req.file) {
    const newProductImage = await imagesService.addImage(req.file.path);
    req.body.productImage = newProductImage;
  }

  const isUpdated = await productsService.updateProduct(productId, req.body);

  if (!isUpdated) {
    const error = new AppError("Invalid product id", 400, httpStatusText.FAIL);
    return next(error);
  }

  const updatedProduct = await productsService.findProduct(productId);

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
