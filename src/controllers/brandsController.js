import { validationResult } from "express-validator";
import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import appError from "../utils/AppError.js";
import httpStatusText from "../utils/httpStatusText.js";
import brandsService from "../services/brandsService.js";

const getAllBrands = asyncWrapper(async (req, res, next) => {
  const brands = await brandsService.findAllBrands();
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { brands } });
});

const getBrand = asyncWrapper(async (req, res, next) => {
  const { brandId } = req.params;
  const brand = await brandsService.findBrand(brandId);

  if (!brand) {
    const error = appError.create("Brand not found", 400, httpStatusText.FAIL);
    return next(error);
  }

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { brand } });
});

const createBrand = asyncWrapper(async (req, res, next) => {
  const { brandName } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const newBrandId = await brandsService.addNewBrand(brandName);

  const brandData = {
    id: newBrandId,
    brandName,
  };

  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { brandData } });
});

const updateBrand = asyncWrapper(async (req, res, next) => {
  const { brandId } = req.params;
  const { brandName } = req.body;

  const findBrandAndUpdate = await brandsService.updateBrand(
    brandId,
    brandName
  );

  if (!findBrandAndUpdate) {
    const error = appError.create("Invalid Brand id", 400, httpStatusText.FAIL);
    return next(error);
  }

  const updatedBrand = { id: +brandId, brandName };
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { updatedBrand },
  });
});

const deleteBrand = asyncWrapper(async (req, res, next) => {
  const { brandId } = req.params;
  const findBrandAndDelete = await brandsService.deleteBrand(brandId);

  if (!findBrandAndDelete) {
    const error = appError.create("Invalid Brand id", 400, httpStatusText.FAIL);
    return next(error);
  }

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

export { getAllBrands, getBrand, createBrand, updateBrand, deleteBrand };
