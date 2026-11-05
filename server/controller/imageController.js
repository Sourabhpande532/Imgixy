import mongoose from "mongoose";
import Image from "../models/Image.js";
import Album from "../models/Album.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const parseTags = (rawTags) => {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) {
    return rawTags
      .flatMap((t) => String(t).split(","))
      .map((t) => t.trim())
      .filter(Boolean);
  }
  if (typeof rawTags === "string") {
    const trimmed = rawTags.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .flatMap((t) => String(t).split(","))
            .map((t) => t.trim())
            .filter(Boolean);
        }
      } catch {
        // Fallback to comma split
      }
    }
    return trimmed
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeImage = (doc) => {
  if (!doc) return doc;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  delete obj.__v;
  delete obj.public_id;
  return {
    ...obj,
    imageId: obj.imageId || obj._id,
    tags: parseTags(obj.tags),
    uploadedAt: obj.uploadedAt || obj.uploadedAT || new Date(),
  };
};

const verifyAlbumAccess = async (albumId, user) => {
  if (!mongoose.Types.ObjectId.isValid(albumId)) {
    return { ok: false, status: 404, error: "Album not found." };
  }
  const album = await Album.findById(albumId).lean();
  if (!album) {
    return { ok: false, status: 404, error: "Album not found." };
  }
  const isOwner = album.ownerId?.toString() === user.id;
  const isShared = (album.sharedWith || []).some(
    (email) => email.toLowerCase() === (user.email || "").toLowerCase(),
  );
  if (!isOwner && !isShared) {
    return {
      ok: false,
      status: 403,
      error: "You do not have access to this album.",
    };
  }
  return { ok: true, album, isOwner };
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Please select an image file to upload." });
    }

    const albumId = req.params.albumId;
    const access = await verifyAlbumAccess(albumId, req.user);
    if (!access.ok) {
      return res.status(access.status).json({ error: access.error });
    }

    const parsedTags = parseTags(req.body.tags);
    const isFav =
      req.body.isFavorite === true || req.body.isFavorite === "true";
    const person =
      typeof req.body.person === "string" ? req.body.person.trim() : "";

    const stream = cloudinary.uploader.upload_stream(
      { folder: "kaviospix" },
      async (err, result) => {
        if (err || !result) {
          return res
            .status(500)
            .json({ error: "Failed to upload image to cloud storage." });
        }

        try {
          const now = new Date();
          const image = await Image.create({
            albumId,
            name: req.file.originalname,
            url: result.secure_url,
            public_id: result.public_id,
            size: req.file.size,
            tags: parsedTags,
            person,
            isFavorite: isFav,
            uploadedAt: now,
            uploadedAT: now,
          });
          res.json(normalizeImage(image));
        } catch {
          res.status(500).json({ error: "Failed to save image metadata." });
        }
      },
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch {
    res.status(500).json({ error: "Upload failed. Please try again." });
  }
};

export const getImages = async (req, res) => {
  try {
    const albumId = req.params.albumId;
    const access = await verifyAlbumAccess(albumId, req.user);
    if (!access.ok) {
      return res.status(access.status).json({ error: access.error });
    }

    const filter = { albumId };
    const images = await Image.find(filter)
      .sort({ uploadedAt: -1, uploadedAT: -1 })
      .lean();
    let normalized = images.map(normalizeImage);

    if (req.query.tags) {
      const requestedTags = parseTags(req.query.tags).map((t) =>
        t.toLowerCase(),
      );
      if (requestedTags.length > 0) {
        normalized = normalized.filter((img) =>
          (img.tags || []).some((tag) =>
            requestedTags.includes(tag.toLowerCase()),
          ),
        );
      }
    }

    res.json(normalized);
  } catch {
    res.status(500).json({ error: "Failed to fetch images." });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const albumId = req.params.albumId;
    const access = await verifyAlbumAccess(albumId, req.user);
    if (!access.ok) {
      return res.status(access.status).json({ error: access.error });
    }

    const images = await Image.find({
      albumId,
      isFavorite: true,
    })
      .sort({ uploadedAt: -1, uploadedAT: -1 })
      .lean();
    res.json(images.map(normalizeImage));
  } catch {
    res.status(500).json({ error: "Failed to fetch favorite images." });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { imageId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res.status(404).json({ error: "Image not found" });
    }

    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ error: "Image not found" });

    if (image.albumId) {
      const access = await verifyAlbumAccess(image.albumId, req.user);
      if (!access.ok) {
        return res.status(access.status).json({ error: access.error });
      }
    }

    image.isFavorite =
      typeof req.body?.isFavorite === "boolean"
        ? req.body.isFavorite
        : !image.isFavorite;
    await image.save();

    res.json(normalizeImage(image));
  } catch {
    res.status(500).json({ error: "Failed to update favorite status." });
  }
};

export const addComment = async (req, res) => {
  try {
    const { imageId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res.status(404).json({ error: "Image not found" });
    }

    const rawComment = req.body?.comment;
    if (!rawComment || typeof rawComment !== "string" || !rawComment.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty." });
    }

    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ error: "Image not found" });

    if (image.albumId) {
      const access = await verifyAlbumAccess(image.albumId, req.user);
      if (!access.ok) {
        return res.status(access.status).json({ error: access.error });
      }
    }

    image.comments.push(rawComment.trim());
    await image.save();

    res.json(normalizeImage(image));
  } catch {
    res.status(500).json({ error: "Failed to add comment." });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res.status(404).json({ error: "Image not found" });
    }

    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Verify ownership of the parent album (Checklist 5.4 & 7: Shared users cannot delete images)
    if (image.albumId) {
      const album = await Album.findById(image.albumId).lean();
      if (album && album.ownerId && album.ownerId.toString() !== req.user.id) {
        return res.status(403).json({
          msg: "Not allowed",
          error: "Shared users have view-only access and cannot delete images.",
        });
      }
    }

    if (image.public_id) {
      try {
        await cloudinary.uploader.destroy(image.public_id);
      } catch {
        // Ignore Cloudinary deletion error so DB record can still be removed
      }
    }
    await image.deleteOne();

    res.json({ msg: "Deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete image." });
  }
};
