const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Message = require('./models/Message');
const Channel = require('./models/Channel');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/channels', require('./routes/channels'));
app.use('/api/messages', require('./routes/messages'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Discord Clone API is running' });
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a channel room
  socket.on('joinChannel', (channelId) => {
    socket.join(channelId);
    console.log(`Socket ${socket.id} joined channel ${channelId}`);
  });

  // Leave a channel room
  socket.on('leaveChannel', (channelId) => {
    socket.leave(channelId);
    console.log(`Socket ${socket.id} left channel ${channelId}`);
  });

  // Send a message
  socket.on('sendMessage', async (data) => {
    try {
      const { content, channelId, senderId } = data;

      // Save message to database
      const message = new Message({
        content,
        sender: senderId,
        channel: channelId,
      });
      await message.save();

      // Populate sender info
      await message.populate('sender', 'username');

      // Broadcast message to everyone in the channel
      io.to(channelId).emit('receiveMessage', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { message: 'Failed to send message' });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Seed default "general" channel if none exist
const seedDefaultChannel = async () => {
  try {
    const channelCount = await Channel.countDocuments();
    if (channelCount === 0) {
      await Channel.create({
        name: 'general',
        description: 'General discussion channel',
        members: [],
        createdBy: null,
      });
      console.log('Default "general" channel created');
    }
  } catch (error) {
    // Channel might already exist, that's fine
  }
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  seedDefaultChannel();
});
