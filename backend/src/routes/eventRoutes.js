const express = require('express');
const {
  createEvent,
  getApprovedEvents,
  filterEvents,
  updateEventStatus,
  deleteEvent,
  adminGetAllEvents,
  incrementView,
  getEvent,
  updateEvent
} = require('../controllers/eventController');


const validate = require('../middlewares/validate');
const { createEventSchema } = require('../validations/eventValidation');

const { protect, authorize } = require('../middlewares/authMiddleware');

const { apiLimiter, viewLimiter } = require('../middlewares/rateLimit');

const router = express.Router();

// Apply general API limiter to all event routes
router.use(apiLimiter);

// Order matters: specific routes before generic ones (if any)
router.get('/filter', filterEvents);
router.get('/admin', protect, authorize('admin'), adminGetAllEvents);
router.route('/').get(getApprovedEvents).post(protect, validate(createEventSchema), createEvent);

router.route('/:id')
  .get(getEvent)
  .put(protect, authorize('admin'), updateEventStatus)
  .delete(protect, authorize('admin'), deleteEvent);

router.put('/:id/edit', protect, authorize('admin'), updateEvent);

router.put('/:id/view', viewLimiter, incrementView);

module.exports = router;


