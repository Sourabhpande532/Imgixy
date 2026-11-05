import mongoose from "mongoose";
import Album from "../models/Album.js";
import Image from "../models/Image.js";
import cloudinary from "../config/cloudinary.js";

const formatAlbum = (doc) => {
  if (!doc) return doc;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  delete obj.__v;
  return {
    ...obj,
    albumId: obj.albumId || obj._id,
  };
};

export const createAlbum = async (req, res) => {
  try {
    const rawName = req.body?.name;
    if (!rawName || typeof rawName !== "string" || !rawName.trim()) {
      return res.status(400).json({
        msg: "Album name is required",
        error: "Album name is required",
      });
    }

    const album = await Album.create({
      name: rawName.trim(),
      description:
        typeof req.body.description === "string"
          ? req.body.description.trim()
          : "",
      ownerId: req.user.id,
    });
    res.json(formatAlbum(album));
  } catch {
    res
      .status(500)
      .json({ msg: "Failed to create album", error: "Failed to create album" });
  }
};

export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find({
      $or: [{ ownerId: req.user.id }, { sharedWith: req.user.email }],
    })
      .sort({ createdAt: -1 })
      .lean();
    res.json(albums.map(formatAlbum));
  } catch {
    res
      .status(500)
      .json({ msg: "Failed to fetch albums", error: "Failed to fetch albums" });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const albumId = req.params.id || req.params.albumId;
    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res
        .status(404)
        .json({ msg: "Album not found", error: "Album not found" });
    }

    const album = await Album.findById(albumId);
    if (!album) {
      return res
        .status(404)
        .json({ msg: "Album not found", error: "Album not found" });
    }

    if (album.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        msg: "Not allowed",
        error: "Only the album owner can update this album",
      });
    }

    if (typeof req.body?.name === "string" && req.body.name.trim()) {
      album.name = req.body.name.trim();
    }
    if (req.body?.description !== undefined) {
      album.description = String(req.body.description).trim();
    }

    await album.save();
    res.json(formatAlbum(album));
  } catch {
    res
      .status(500)
      .json({ msg: "Failed to update album", error: "Failed to update album" });
  }
};

export const shareAlbum = async (req, res) => {
  try {
    const albumId = req.params.id || req.params.albumId;
    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res
        .status(404)
        .json({ msg: "Album not found", error: "Album not found" });
    }

    const album = await Album.findById(albumId);
    if (!album) {
      return res
        .status(404)
        .json({ msg: "Album not found", error: "Album not found" });
    }

    if (album.ownerId && album.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        msg: "Not allowed",
        error: "Only the album owner can share this album",
      });
    }

    const emails = req.body?.emails;
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        msg: "Invalid emails provided",
        error: "Invalid emails provided",
      });
    }

    const normalized = emails
      .map((e) => (typeof e === "string" ? e.trim().toLowerCase() : ""))
      .filter(Boolean);

    if (normalized.length === 0) {
      return res.status(400).json({
        msg: "Invalid emails provided",
        error: "Invalid emails provided",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasInvalid = normalized.some(
      (e) => !e.includes("@") || !emailRegex.test(e),
    );
    if (hasInvalid) {
      return res.status(400).json({
        msg: "Invalid email format. Must contain @",
        error: "Invalid email format. Must contain @",
      });
    }

    const existing = new Set(
      (album.sharedWith || []).map((e) => e.toLowerCase()),
    );
    for (const email of normalized) {
      if (!existing.has(email)) {
        album.sharedWith.push(email);
        existing.add(email);
      }
    }

    await album.save();
    res.json(formatAlbum(album));
  } catch {
    res
      .status(500)
      .json({ msg: "Failed to share album", error: "Failed to share album" });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const albumId = req.params.id || req.params.albumId;
    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res
        .status(404)
        .json({ msg: "Album not found", error: "Album not found" });
    }

    const album = await Album.findById(albumId);
    if (!album) {
      return res
        .status(404)
        .json({ msg: "Album not found", error: "Album not found" });
    }

    if (album.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        msg: "Not allowed",
        error: "Only the album owner can delete this album",
      });
    }

    // Delete all associated images in the album (Checklist 4.4)
    const associatedImages = await Image.find({ albumId: album._id }).lean();
    for (const img of associatedImages) {
      if (img.public_id) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch {
          // Continue cleanup even if remote Cloudinary deletion fails
        }
      }
    }
    await Image.deleteMany({ albumId: album._id });
    await album.deleteOne();

    res.json({ msg: "Deleted" });
  } catch {
    res
      .status(500)
      .json({ msg: "Failed to delete album", error: "Failed to delete album" });
  }
};
