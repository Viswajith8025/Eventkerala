const express = require('express');
const {
  toggleWishlist,
  toggleFollowDistrict,
  getMe,
  updateProfile
} = require('../controllers/userController');

const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // All user routes are protected

router.get('/me', getMe);
router.post('/wishlist/:eventId', toggleWishlist);
router.post('/follow-district', toggleFollowDistrict);
router.put('/profile', updateProfile);

module.exports = router;
