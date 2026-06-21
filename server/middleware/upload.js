import multer from "multer";
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only images allowd"), false);
};

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 10 MB
  fileFilter,
});
