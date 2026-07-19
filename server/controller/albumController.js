import Album from "../models/Album.js";

export const createAlbum = async (req, res) => {
  const album = await Album.create({
    ...req.body,
    ownerId: req.user.id,
  });
  res.json(album);
};

export const getAlbums = async (req, res) => {
  const albums = await Album.find({
    $or: [{ ownerId: req.user.id }, { sharedWith: req.user.email }],
  });
  res.json(albums);
};

export const updateAlbum = async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (album.ownerId.toString() !== req.user.id)
    return res.status(403).json({ msg: "Not allowed" });

  album.description = req.body.description;
  await album.save();

  res.json(album);
};

export const shareAlbum = async (req, res) => {
  const album = await Album.findById(req.params.id);

  const emails = req.body.emails;
  if (!emails || !Array.isArray(emails)) {
    return res.status(400).json({ msg: "Invalid emails provided" });
  }

  const hasInvalid = emails.some(e => !e.includes('@'));
  if (hasInvalid) {
    return res.status(400).json({ msg: "Invalid email format. Must contain @" });
  }

  album.sharedWith.push(...emails);
  await album.save();

  res.json(album);
};

export const deleteAlbum = async (req, res) => {
  const album = await Album.findById(req.params.id);

  if (album.ownerId.toString() !== req.user.id)
    return res.status(403).json({ msg: "Not allowed" });

  await album.deleteOne();
  res.json({ msg: "Deleted" });
};
