const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const catchAsync = require('../utils/catchAsync');

// @desc    Toggle wishlist item
// @route   POST /api/v1/user/wishlist/:eventId
// @access  Private
exports.toggleWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const eventId = req.params.eventId;

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Handle string vs ObjectId comparison
  const isWishlisted = user.wishlist.some(id => id.toString() === eventId);
  const update = isWishlisted 
    ? { $pull: { wishlist: eventId } } 
    : { $addToSet: { wishlist: eventId } };

  const updatedUser = await User.findByIdAndUpdate(req.user.id, update, { new: true });

  res.status(200).json({
    success: true,
    data: updatedUser.wishlist,
    message: isWishlisted ? 'Removed from legend list' : 'Added to legend list'
  });
});

// @desc    Toggle place wishlist item
// @route   POST /api/v1/user/place-wishlist/:placeId
// @access  Private
exports.togglePlaceWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const placeId = req.params.placeId;

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const isWishlisted = user.placeWishlist.some(id => id.toString() === placeId);
  const update = isWishlisted 
    ? { $pull: { placeWishlist: placeId } } 
    : { $addToSet: { placeWishlist: placeId } };

  const updatedUser = await User.findByIdAndUpdate(req.user.id, update, { new: true });

  res.status(200).json({
    success: true,
    data: updatedUser.placeWishlist,
    message: isWishlisted ? 'Removed from sacred places' : 'Added to sacred places'
  });
});

// @desc    Toggle follow district
// @route   POST /api/v1/user/follow-district
// @access  Private
exports.toggleFollowDistrict = catchAsync(async (req, res, next) => {
  const { district } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const isFollowing = user.followedDistricts.includes(district);
  const update = isFollowing 
    ? { $pull: { followedDistricts: district } } 
    : { $addToSet: { followedDistricts: district } };

  const updatedUser = await User.findByIdAndUpdate(req.user.id, update, { new: true });

  res.status(200).json({
    success: true,
    data: updatedUser.followedDistricts,
    message: isFollowing ? `Unfollowed ${district}` : `Following ${district} traditions`
  });
});

// @desc    Get user profile (including populated wishlist)
// @route   GET /api/v1/user/me
// @access  Private
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: 'wishlist',
      select: 'title date image district category'
    })
    .populate({
      path: 'placeWishlist',
      select: 'name image district category description'
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

  // MED-05: Basic validation for interests array
  if (interests && !Array.isArray(interests)) {
    return next(new ErrorResponse('Interests must be an array of strings', 400));
  }

  const updateData = { name, phone };
  if (interests) {
    updateData.interests = interests.map(String).filter(s => s.trim().length > 0);
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: user,
    message: 'Profile updated successfully'
  });
});

// @desc    Upload profile image
// @route   POST /api/v1/user/profile-image
// @access  Private
exports.uploadProfileImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  // Path where file is stored (relative to public)
  const imagePath = req.file.path;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: imagePath },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: user,
    message: 'Profile image updated successfully'
  });
});

// @desc    Delete user account (GDPR compliance)
// @route   DELETE /api/v1/user/me
// @access  Private
exports.deleteAccount = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Perform permanent deletion
  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Identity and records successfully purged from the chronicles.'
  });
});
