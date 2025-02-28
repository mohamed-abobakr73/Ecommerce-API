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
    folder: "ecommerce-backend",
    format: async (req, file) => {
      return ["jpeg", "jpg", "png", "gif", "webp"].includes(
        file.mimetype.split("/")[1]
      )
        ? file.mimetype.split("/")[1]
        : "jpg";
    },
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage: storage });

export default upload;
