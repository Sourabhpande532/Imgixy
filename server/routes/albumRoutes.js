import express from "express";
const router = express.Router();
import {
  createAlbum,
  getAlbums,
  updateAlbum,
  shareAlbum,
  deleteAlbum,
} from "../controller/albumController.js";
import { protect } from "../middleware/auth.js";

router.post("/", protect, createAlbum);
router.get("/", protect, getAlbums);
router.put("/:id", protect, updateAlbum);
router.post("/:id/share", protect, shareAlbum);
router.delete("/:id", protect, deleteAlbum);
export default router;
