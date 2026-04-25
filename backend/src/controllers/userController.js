const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const catchAsync = require('../utils/catchAsync');

// @desc    Toggle wishlist item
// @route   POST /api/v1/user/wishlist/:eventId
// @access  Private
exports.toggleWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const eventId = req.params.eventId;

  const isWishlisted = user.wishlist.includes(eventId);

  if (isWishlisted) {
    user.wishlist = user.wishlist.filter(id => id.toString() !== eventId);
  } else {
    user.wishlist.push(eventId);
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user.wishlist,
    message: isWishlisted ? 'Removed from legend list' : 'Added to legend list'
  });
});

// @desc    Toggle follow district
// @route   POST /api/v1/user/follow-district
// @access  Private
exports.toggleFollowDistrict = catchAsync(async (req, res, next) => {
  const { district } = req.body;
  const user = await User.findById(req.user.id);

  const isFollowing = user.followedDistricts.includes(district);

  if (isFollowing) {
    user.followedDistricts = user.followedDistricts.filter(d => d !== district);
  } else {
    user.followedDistricts.push(district);
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user.followedDistricts,
    message: isFollowing ? `Unfollowed ${district}` : `Following ${district} traditions`
  });
});

// @desc    Get user profile (including populated wishlist)
// @route   GET /api/v1/user/me
// @access  Private
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'title date image district category'
  });

  res.status(200).json({
    success: true,
    data: user
  });
});
// @desc    Update user profile
// @route   PUT /api/v1/user/profile
// @access  Private
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name, phone, interests } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone, interests },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: user,
    message: 'Profile updated successfully'
  });
});
