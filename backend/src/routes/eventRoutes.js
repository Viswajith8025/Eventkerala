const express = require('express');
const {
  createEvent,
  getApprovedEvents,
  filterEvents,
  updateEventStatus,
  deleteEvent,
  adminGetAllEvents,
  incrementView,
  getEvent
} = require('../controllers/eventController');


const validate = require('../middlewares/validate');
const { createEventSchema } = require('../validations/eventValidation');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Order matters: specific routes before generic ones (if any)
router.get('/filter', filterEvents);
router.get('/admin', protect, authorize('admin'), adminGetAllEvents);
router.route('/').get(getApprovedEvents).post(protect, validate(createEventSchema), createEvent);

router.route('/:id')
  .get(getEvent)
  .put(protect, authorize('admin'), updateEventStatus)
  .delete(protect, authorize('admin'), deleteEvent);

router.put('/:id/view', incrementView);

module.exports = router;


