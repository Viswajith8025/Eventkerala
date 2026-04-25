const express = require('express');
const router = express.Router();
const { getMessages, saveMessage, getAllMessages } = require('../controllers/messageController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public: Anyone can read messages for an event
router.route('/:eventId').get(getMessages);

// Protected: Must be logged in to send messages
router.post('/', protect, saveMessage);

// Admin Only: High-level overview
router.get('/', protect, authorize('admin'), getAllMessages);

module.exports = router;

