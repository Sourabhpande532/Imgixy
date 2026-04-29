import Album from "../models/Album";

export const createAlbum = async (req, res) => {
  const album = await Album.create({
    ...req.body,
    ownerId: req.user.id,
  });
  res.json(album);
};
