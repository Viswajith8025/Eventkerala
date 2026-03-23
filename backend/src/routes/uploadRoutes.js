const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');
const { protect } = require('../middlewares/authMiddleware');

// @desc    Upload an image to Cloudinary
// @route   POST /api/v1/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  res.status(200).json({
    success: true,
    url: req.file.path, // Cloudinary provides the URL in req.file.path
  });
});

module.exports = router;
