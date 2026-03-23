const Message = require('../models/Message');

// @desc    Get all messages for an event
// @route   GET /api/v1/messages/:eventId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ event: req.params.eventId })
      .sort('createdAt');

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a new message
// @route   POST /api/v1/messages
// @access  Private
exports.saveMessage = async (req, res, next) => {
  try {
    const { event, content, senderName } = req.body;
    
    const message = await Message.create({
      event,
      sender: req.user.id,
      content,
      senderName
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
