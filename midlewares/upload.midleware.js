import multer from "multer";
const storage = multer.diskStorage({
    destination: "./public/uploads/movies",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const upload = multer({
    storage: storage,
  });
  export default upload;