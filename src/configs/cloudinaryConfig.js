import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { config } from "dotenv";

config();

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "ecommerce-API",
    format: async (req, file) => {
      const fileFormat = file.mimetype.split("/")[1];
      return ["jpeg", "jpg", "png", "gif", "webp"].includes(fileFormat)
        ? fileFormat
        : "jpg";
    },
    public_id: (req, file) => {
      return file.originalname.split(".")[0];
    },
  },
});

const upload = multer({ storage: storage });

export default upload;
