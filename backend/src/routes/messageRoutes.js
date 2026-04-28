const express = require('express');
const router = express.Router();
const { getMessages, saveMessage, getAllMessages, getSupportMessages } = require('../controllers/messageController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/support/:userId', protect, getSupportMessages);

// Protected: Only logged in users can read their messages for an event
router.route('/:eventId').get(protect, getMessages);

// Protected: Must be logged in to send messages
router.post('/', protect, saveMessage);

// Admin Only: High-level overview
router.get('/', protect, authorize('admin'), getAllMessages);

module.exports = router;

