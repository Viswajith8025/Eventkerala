const Place = require('../models/Place');

// @desc    Get all places
// @route   GET /api/v1/places
// @access  Public
exports.getPlaces = async (req, res, next) => {
  try {
    const { district } = req.query;
    let query = {};

    if (district) {
      query.district = district;
    }

    const places = await Place.find(query).sort('name');

    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a place (Admin/Setup)
// @route   POST /api/v1/places
// @access  Public (for easier setup, normally protected)
exports.createPlace = async (req, res, next) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json({
      success: true,
      data: place,
    });
  } catch (error) {
    next(error);
  }
};
