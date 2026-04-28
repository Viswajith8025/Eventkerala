const Contact = require('../models/Contact');
const asyncHandler = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Submit contact form
// @route   POST /api/v1/contact
// @access  Public
exports.submitContact = asyncHandler(async (req, res, next) => {
  const { name, email, subject, message } = req.body;
  
  try {
    const contact = await Contact.create({
      name, email, subject, message
    });
    
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
