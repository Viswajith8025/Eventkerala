const Contact = require('../models/Contact');
const Message = require('../models/Message');
const asyncHandler = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Submit contact form
// @route   POST /api/v1/contact
// @access  Public
exports.submitContact = asyncHandler(async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;
  
  try {
    const contactData = { name, phone, subject, message };
    
    // Use provided email or fallback to logged in user email
    if (email) contactData.email = email;
    
    // If user is logged in (via optionalProtect), link the message and get their email
    if (req.user) {
      contactData.user = req.user.id;
      if (!contactData.email) contactData.email = req.user.email;
    }

    const contact = await Contact.create(contactData);
    
    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Get all contact messages
// @route   GET /api/v1/contact
// @access  Private/Admin
exports.getContacts = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find().sort('-createdAt');

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});

// @desc    Reply to contact message
// @route   PUT /api/v1/contact/:id/reply
// @access  Private/Admin
exports.replyToContact = asyncHandler(async (req, res, next) => {
  const { reply } = req.body;

  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`No contact message with id of ${req.params.id}`, 404));
  }

  contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { 
      adminReply: reply,
      status: 'replied'
    },
    {
      new: true,
      runValidators: true
    }
  );

  // If this contact was linked to a user, start a real-time support message thread
  if (contact.user) {
    const message = await Message.create({
      room: 'support',
      sender: req.user.id,
      senderName: 'LiveKeralam Admin',
      content: reply,
      recipient: contact.user
    });

    // Real-time socket emission for support
    const io = req.app.get('socketio');
    if (io) {
      const socketRoom = `support:${contact.user}`;
      io.to(socketRoom).emit('receive_message', {
        ...message._doc,
        room: 'support'
      });
    }
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Delete contact message
// @route   DELETE /api/v1/contact/:id
// @access  Private/Admin
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(`No contact message with id of ${req.params.id}`, 404));
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current user's enquiries
// @route   GET /api/v1/contact/me
// @access  Private
exports.getMyEnquiries = asyncHandler(async (req, res, next) => {
  const enquiries = await Contact.find({ user: req.user.id }).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: enquiries.length,
    data: enquiries
  });
});
