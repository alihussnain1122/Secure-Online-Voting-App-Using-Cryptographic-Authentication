const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage'); // ✅ Named import
require('dotenv').config();

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'photos',
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

// ✅ Check if storage is working
const upload = multer({ storage });

module.exports = upload; // ✅ This must be a multer instance
