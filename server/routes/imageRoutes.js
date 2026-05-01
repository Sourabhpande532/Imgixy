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

router.post("/:albumId", protect, upload.single("file"), uploadImage);
router.get("/:albumId", protect, getImages);
router.get("/:albumId/favorites", protect, getFavorites);

router.put("/:imageId/favorite", protect, toggleFavorite);
router.post("/:imageId/comment", protect, addComment);
router.delete("/:imageId", protect, deleteImage);

export default router;
