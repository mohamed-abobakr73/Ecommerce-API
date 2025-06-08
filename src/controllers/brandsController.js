import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import httpStatusText from "../utils/httpStatusText.js";
import brandsService from "../services/brandsService.js";

const getAllBrands = asyncWrapper(async (req, res, next) => {
  const brands = await brandsService.findAllBrandsService();

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { brands } });
});

const getBrand = asyncWrapper(async (req, res, next) => {
  const { brandId } = req.params;

  const brand = await brandsService.findBrandService(brandId);

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { brand } });
});

const createBrand = asyncWrapper(async (req, res, next) => {
  const validatedData = req.body;

  const { brandName } = validatedData;

  const newBrandId = await brandsService.createBrandService(brandName);

  const brandData = {
    id: newBrandId,
    brandName,
  };

  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { brand: brandData } });
});

const updateBrand = asyncWrapper(async (req, res, next) => {
  const { brandId } = req.params;

  const validatedData = req.body;

  const { brandName } = validatedData;

  await brandsService.updateBrandService(brandId, brandName);

  const updatedBrand = { brandId: +brandId, brandName };

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { updatedBrand },
  });
});

const deleteBrand = asyncWrapper(async (req, res, next) => {
  const { brandId } = req.params;

  await brandsService.deleteBrandService(brandId);

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

export { getAllBrands, getBrand, createBrand, updateBrand, deleteBrand };
