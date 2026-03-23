const Event = require('../models/Event');

// @desc    Create new event
// @route   POST /api/v1/events
// @access  Public (for now, until auth is added)
exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    
    // Emit real-time notification
    const io = req.app.get('socketio');
    if (io) {
      io.emit('new_event', {
        title: event.title,
        district: event.district,
        _id: event._id
      });
    }

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all approved events
// @route   GET /api/v1/events
// @access  Public
exports.getApprovedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: 'approved' }).sort('-date');
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Filter events by district and/or date
// @route   GET /api/v1/events/filter
// @access  Public
exports.filterEvents = async (req, res, next) => {
  try {
    const { district, date, search } = req.query;
    let query = { status: 'approved' };

    if (district) {
      query.district = district;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Default sort: Latest first (-date)
    const events = await Event.find(query).sort('-date');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject event (Admin)
// @route   PUT /api/v1/events/:id
// @access  Private/Admin
exports.updateEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Please use approved, rejected, or pending.',
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event (Admin)
// @route   DELETE /api/v1/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
