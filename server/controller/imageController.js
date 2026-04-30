import Image from "../models/Image.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadImage = async (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: "kaviospix" },
    async (err, result) => {
      if (err) return res.status(500).json(err);

      const image = await Image.create({
        albumId: req.params.albumId,
        name: req.file.originalname,
        url: result.secure_url,
        public_id: result.public_id,
        size: req.file.size,
        tags: req.body.tags || [],
        person: req.body.person,
        isFavorite: req.body.isFavorite,
      });
      res.json(image);
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
};

export const getImages = async (req, res) => {
  const filter = { albumId: req.params.albumId };

  if (req.query.tags) filter.tags = req.query.tags;

  const images = await Image.find(filter);
  res.json(images);
};

export const getFavorites = async (req, res) => {
  const images = await Image.find({
    albumId: req.params.albumId,
    isFavorite: true,
  });
  res.json(images);
};

export const toggleFavorite = async (req, res) => {
  const image = await Image.findById(req.params.imageId);
  image.isFavorite = req.body.isFavorite;
  await image.save();

  res.json(image);
};

export const addComment = async (req, res) => {
  const image = await Image.findById(req.params.imageId);
  image.comments.push(req.body.comment);
  await image.save();

  res.json(image);
};

export const deleteImage = async (req, res) => {
  const image = await Image.findById(req.params.imageId);

  await cloudinary.uploader.destroy(image.public_id);
  await image.deleteOne();

  res.json({ msg: "Deleted" });
};