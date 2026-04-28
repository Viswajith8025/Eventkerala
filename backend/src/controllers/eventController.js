const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const catchAsync = require('../utils/catchAsync');

// @desc    Create new event
// @route   POST /api/v1/events
// @access  Private
exports.createEvent = catchAsync(async (req, res, next) => {
  // Whitelist fields to prevent mass assignment
  const { title, description, district, date, location, category, price, bookingLink, image, latitude, longitude, chatEnabled } = req.body;
  
  const eventData = {
    title, description, district, date, location, category, price, bookingLink, image, latitude, longitude, chatEnabled,
    organizer: req.user.id,
    status: req.user.role === 'admin' ? (req.body.status || 'approved') : 'pending'
  };

  const event = await Event.create(eventData);

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
});

// @desc    Get all approved events (Optimized for performance)
// @route   GET /api/v1/events
// @access  Public
exports.getApprovedEvents = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;

  const events = await Event.find({ 
      status: 'approved',
      date: { $gte: new Date() }
    })
    .select('-description') 
    .sort('date')
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: events.length,
    page,
    data: events,
  });
});

// @desc    Filter events by district and/or date (High-performance Text Search)
// @route   GET /api/v1/events/filter
// @access  Public
exports.filterEvents = catchAsync(async (req, res, next) => {
  const { district, date, search } = req.query;
  let query = { status: 'approved' };
  const now = new Date();

  if (district) {
    query.district = district;
  }

  if (date) {
    // Fix for HIGH-08: Avoid mutation of Date objects
    const startOfSearchDay = new Date(date);
    startOfSearchDay.setHours(0,0,0,0);
    
    const endOfSearchDay = new Date(date);
    endOfSearchDay.setHours(23,59,59,999);
    
    const effectiveStart = startOfSearchDay > now ? startOfSearchDay : now;
    query.date = { $gte: effectiveStart, $lte: endOfSearchDay };
  } else {
    query.date = { $gte: now };
  }

  // Use MongoDB Text Indexes for the search term
  if (search) {
    query.$text = { $search: search };
  }

  // Default projection: Exclude heavy description for list efficiency
  let mongoQuery = Event.find(query).select('-description');

  // If searching, sort by relevance score
  if (search) {
      mongoQuery = mongoQuery.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
  } else {
      mongoQuery = mongoQuery.sort('date');
  }

  const events = await mongoQuery;

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});


// @desc    Approve or reject event (Admin)
// @route   PUT /api/v1/events/:id
// @access  Private/Admin
exports.updateEventStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending', 'finished'].includes(status)) {
    return next(new ErrorResponse('Invalid status. Please use approved, rejected, pending, or finished.', 400));
  }

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!event) {
    return next(new ErrorResponse('Event not found', 404));
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc    Update an event (Admin)
// @route   PUT /api/v1/events/:id/edit
// @access  Private/Admin
exports.updateEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!event) {
    return next(new ErrorResponse('Event not found', 404));
  }

  res.status(200).json({
    success: true,
    data: event,
    message: 'Chronicle entry updated successfully'
  });
});

// @desc    Delete event (Admin)
// @route   DELETE /api/v1/events/:id
// @access  Private/Admin
exports.deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new ErrorResponse('Event not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
  });
});

// @desc    Get all events (Admin - including pending/rejected)
// @route   GET /api/v1/events/admin
// @access  Private/Admin
exports.adminGetAllEvents = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100; // Increased for admin dashboard efficiency
  const skip = (page - 1) * limit;

  const total = await Event.countDocuments();
  const events = await Event.find()
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('organizer', 'name email organization');

  res.status(200).json({
    success: true,
    count: events.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: events,
  });
});

// @desc    Increment view count (analytics)
// @route   PUT /api/v1/events/:id/view
// @access  Public
exports.incrementView = catchAsync(async (req, res, next) => {
  await Event.findByIdAndUpdate(req.params.id, {
    $inc: { 'analytics.views': 1 }
  });
  res.status(200).json({ success: true });
});

// @desc    Get single event
// @route   GET /api/v1/events/:id
// @access  Public
exports.getEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name organization');

  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});


