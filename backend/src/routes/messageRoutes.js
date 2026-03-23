const express = require('express');
const router = express.Router();
const { getMessages, saveMessage } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/:eventId').get(getMessages);
router.route('/').post(saveMessage);

module.exports = router;
