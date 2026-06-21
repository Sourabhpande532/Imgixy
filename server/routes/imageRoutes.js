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

// Wrapper to catch Multer errors (e.g. file too large) and return a friendly message
const handleUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large. Please upload a photo between 1 MB and 10 MB.",
      });
    }
    if (err) {
      return res.status(400).json({ error: err.message || "Upload failed." });
    }
    next();
  });
};

router.post("/:albumId", protect, handleUpload, uploadImage);
router.get("/:albumId", protect, getImages);
router.get("/:albumId/favorites", protect, getFavorites);

router.put("/:imageId/favorite", protect, toggleFavorite);
router.post("/:imageId/comment", protect, addComment);
router.delete("/:imageId", protect, deleteImage);

export default router;
