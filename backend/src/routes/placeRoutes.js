const express = require('express');
const { getPlaces, createPlace } = require('../controllers/placeController');

const router = express.Router();

router.route('/').get(getPlaces).post(createPlace);

module.exports = router;
