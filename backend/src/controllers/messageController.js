const Message = require('../models/Message');

// @desc    Get messages for an event
// @route   GET /api/v1/messages/:eventId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    let query = { event: eventId };

    // SECURITY FIX: If not admin, only show messages where user is sender OR recipient
    if (req.user.role !== 'admin') {
      query.$or = [
        { sender: req.user.id },
        { recipient: req.user.id }
      ];
    }

    const messages = await Message.find(query)
      .populate('sender', 'name')
      .sort('createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
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
    const { event, content, senderName, recipientId } = req.body;
    
    const message = await Message.create({
      event,
      sender: req.user.id,
      content,
      senderName,
      recipient: recipientId // New field to track who the message is for
    });

    res.status(201).json({
      success: true,
      data: message,
    });

    // Handle real-time emission to isolated room
    const io = req.app.get('socketio');
    if (io) {
      // Room ID logic: if sender is user, room is event:userId. 
      // If sender is admin, room is event:recipientId.
      const targetUserId = req.user.role === 'admin' ? recipientId : req.user.id;
      const room = `event:${event}:user:${targetUserId}`;
      
      io.to(room).emit('receive_message', {
        ...message._doc,
        eventId: event
      });
    }
  } catch (error) {
    next(error);
  }
};
// @desc    Get all messages (Admin)
// @route   GET /api/v1/messages
// @access  Private/Admin
exports.getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .populate('event', 'title')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
