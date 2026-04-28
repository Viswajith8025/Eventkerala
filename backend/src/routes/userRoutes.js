const express = require('express');
const {
  toggleWishlist,
  togglePlaceWishlist,
  toggleFollowDistrict,
  getMe,
  updateProfile,
  uploadProfileImage,
  deleteAccount,
  getAllUsers
} = require('../controllers/userController');
const cloudinaryUpload = require('../config/cloudinary');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect); // All user routes are protected

router.get('/me', getMe);
router.get('/admin/users', authorize('admin'), getAllUsers);
router.post('/wishlist/:eventId', toggleWishlist);
router.post('/place-wishlist/:placeId', togglePlaceWishlist);
router.post('/follow-district', toggleFollowDistrict);
router.put('/profile', updateProfile);
router.delete('/me', deleteAccount);
router.post('/profile-image', cloudinaryUpload.single('profileImage'), uploadProfileImage);

module.exports = router;
