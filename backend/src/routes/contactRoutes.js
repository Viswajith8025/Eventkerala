const express = require('express');
const {
  submitContact,
  getContacts,
  replyToContact,
  deleteContact
} = require('../controllers/contactController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');
const { apiLimiter } = require('../middlewares/rateLimit');

router.post('/', apiLimiter, submitContact);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getContacts);
router.put('/:id/reply', replyToContact);
router.delete('/:id', deleteContact);

module.exports = router;
