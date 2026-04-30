import express from "express";
import {
  uploadImage,
  getImages,
  getFavorites,
  toggleFavorite,
  addComment,
  deleteImage,
} from "../controller/imageController.js";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.post("/:albumsId", protect, upload.single("file"), uploadImage);

export default router;
