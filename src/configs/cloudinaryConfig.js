import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "ddk228iop",
  api_key: "395224322189611",
  api_secret: "bwsCVTM6Zn4jS9PRZinWPXAJWCg",
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
