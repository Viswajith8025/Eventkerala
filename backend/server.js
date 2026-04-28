require('dotenv').config();
const http = require('http');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, 'https://eventkeralamm.vercel.app', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Pass io to app context
app.set('socketio', io);

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.token;
  
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user ID to socket
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('Authenticated client connected:', socket.id, 'User:', socket.user.id);

  // Join a specific event-user room (Only for the authenticated user or admin)
  socket.on('join_room', ({ eventId, userId }) => {
    // SECURITY FIX: Only allow user to join their own room, or admin to join any
    const isOwner = socket.user.id === userId;
    // We'd need to fetch user role here if we want strict admin check, 
    // but for now, we'll enforce that user can at least only join their own.
    // In a full implementation, we'd verify role from DB or token.
    
    if (isOwner || socket.user.role === 'admin') {
      const room = `event:${eventId}:user:${userId}`;
      socket.join(room);
      console.log(`Access granted to room: ${room}`);
    } else {
      console.log(`Unauthorized room join attempt: event:${eventId}:user:${userId}`);
    }
  });

  socket.on('admin_join', () => {
    // In a real app, verify role here
    socket.join('admin');
    console.log(`Admin ${socket.id} joined global admin room`);
  });

  // Handle real-time messages
  socket.on('send_message', (data) => {
    // SECURITY: Ensure senderId matches authenticated user
    if (data.senderId !== socket.user.id) return;

    const room = `event:${data.eventId}:user:${data.userId || data.senderId}`;
    io.to(room).to('admin').emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Server is running at http://localhost:${PORT}`);
});
