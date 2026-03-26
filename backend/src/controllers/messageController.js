// @desc    Get messages for an event (Isolated by user)
// @route   GET /api/v1/messages/:eventId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.query; // Admin can pass userId to see specific thread

    let query = { event: eventId };

    // If not admin, force userId to current user
    if (req.user.role !== 'admin') {
      query.sender = req.user.id;
    } else if (userId) {
      // Admin viewing specific user thread
      query.$or = [{ sender: userId }, { sender: req.user.id }]; 
      // This is a bit complex since 'sender' is the one who created the record.
      // We need to fetch messages where the conversation 'owner' is the specified user.
      // Let's refine the Message model or query to track "Thread Owner".
      // Simplified: Find messages for this event where EITHER the sender is the user, 
      // OR it's an admin reply but we need a way to know which user it was for.
      
      // Better: Add 'receiver' or 'threadId' to Message model later, but for now:
      // Filter by event AND (sender is user OR sender is admin but specifically for this conversation)
      // Since we don't have 'receiver' yet, we'll filters by event and look for messages 
      // involving the user. 
      query.sender = userId; 
      // Admin replies currently also use 'sender: adminID'. 
      // We need to find messages where the conversation is between Admin and User.
    }

    // Temporary fix: messages are grouped by 'sender' for users. 
    // For admins to see their REPLIES in the thread, we need to know who the reply was FOR.
    // I'll add 'recipient' to the Message model or use a metadata field.
    
    // For now, let's just isolating by 'sender' for the user side.
    const messages = await Message.find(query).sort('createdAt');

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
