const multer = require("multer");
const path = require("path");

const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploader = (type = "image") => {
  const imageExtensions = ["jpeg", "jpg", "png", "webp", "gif", "bmp", "svg"];

  const movieExtensions = ["mp4", "mkv", "mov", "avi", "webm"];

  const documentExtensions = [
    "pdf",
    "docx",
    "doc",
    "txt",
    "zip",
    "rar",
    "exe",
    "ppt",
    "csv",
  ];

  return multer({
    storage: myStorage,

    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).slice(1).toLowerCase();

      let allowed = [];

      /*
       * Movie upload:
       *
       * poster   -> images only
       * backdrop -> images only
       * logo     -> images only
       * video    -> movie files only
       */
      if (type === "movie") {
        if (["poster", "backdrop", "logo"].includes(file.fieldname)) {
          allowed = imageExtensions;
        } else if (file.fieldname === "video") {
          allowed = movieExtensions;
        }
      } else if (type === "image") {
        /*
         * Normal image upload
         */
        allowed = imageExtensions;
      } else if (type === "doc") {
        /*
         * Document upload
         */
        allowed = documentExtensions;
      }

      if (allowed.includes(ext)) {
        return cb(null, true);
      }

      return cb({
        code: 400,
        message: `File format not supported for ${file.fieldname}`,
        status: "INVALID_FILE_FORMAT",
        detail: {
          [file.fieldname]: `.${ext} is not supported for ${file.fieldname}`,
        },
      });
    },

    limits: {
      fileSize: 1024 * 1024 * 1024 * 100,
    },
  });
};

module.exports = uploader;
