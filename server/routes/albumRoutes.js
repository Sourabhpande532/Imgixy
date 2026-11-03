import express from "express";
const router = express.Router();
import {
  createAlbum,
  getAlbums,
  updateAlbum,
  shareAlbum,
  deleteAlbum,
} from "../controller/albumController.js";
import {
  uploadImage,
  getImages,
  getFavorites,
  toggleFavorite,
  addComment,
  deleteImage,
} from "../controller/imageController.js";
import { handleUpload } from "./imageRoutes.js";
import { protect } from "../middleware/auth.js";

router.post("/", protect, createAlbum);
router.get("/", protect, getAlbums);
router.put("/:id", protect, updateAlbum);
router.post("/:id/share", protect, shareAlbum);
router.delete("/:id", protect, deleteAlbum);

// Nested checklist-compatible aliases (/albums/:albumId/images...)
router.post("/:albumId/images", protect, handleUpload, uploadImage);
router.get("/:albumId/images", protect, getImages);
router.get("/:albumId/images/favorites", protect, getFavorites);
router.put("/:albumId/images/:imageId/favorite", protect, toggleFavorite);
router.post("/:albumId/images/:imageId/comments", protect, addComment);
router.post("/:albumId/images/:imageId/comment", protect, addComment);
router.delete("/:albumId/images/:imageId", protect, deleteImage);

export default router;
