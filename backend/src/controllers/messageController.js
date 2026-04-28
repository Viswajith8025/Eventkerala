const Message = require('../models/Message');

// @desc    Get messages for an event
// @route   GET /api/v1/messages/:eventId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    let query = { event: eventId, room: 'global' }; // Default to event global if room not specified

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

// @desc    Get support messages for a user
// @route   GET /api/v1/messages/support/:userId
// @access  Private/Admin or Private/Self
exports.getSupportMessages = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    
    // Only admin or the user themselves can see their support messages
    if (req.user.role !== 'admin' && req.user.id.toString() !== targetUserId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to support logs' });
    }

    const messages = await Message.find({
      room: 'support',
      $or: [
        { sender: targetUserId },
        { recipient: targetUserId }
      ]
    })
    .populate('sender', 'name')
    .sort('createdAt');

    res.status(200).json({
      success: true,
      data: messages
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
    const { event, content, senderName, recipientId, room = 'global' } = req.body;
    
    const messageData = {
      sender: req.user.id,
      content,
      senderName,
      recipient: recipientId,
      room
    };

    if (event) messageData.event = event;

    const message = await Message.create(messageData);

    res.status(201).json({
      success: true,
      data: message,
    });

    // Handle real-time emission
    const io = req.app.get('socketio');
    if (io) {
      const targetUserId = req.user.role === 'admin' ? recipientId : req.user.id;
      
      let socketRoom;
      if (room === 'support') {
        socketRoom = `support:${targetUserId}`;
      } else {
        socketRoom = `event:${event}:user:${targetUserId}`;
      }
      
      io.to(socketRoom).emit('receive_message', {
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
