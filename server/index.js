import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Socket.io
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('user_connected', (userId) => {
    users[userId] = socket.id;
    io.emit('user_status', { userId, status: 'online' });
    console.log('User connected:', userId);
  });

  socket.on('send_message', (data) => {
    const { receiverId } = data;
    const receiverSocketId = users[receiverId];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', data);
    }
  });

  socket.on('typing', (data) => {
    const { receiverId } = data;
    const receiverSocketId = users[receiverId];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', data);
    }
  });

  socket.on('disconnect', () => {
    // Find user by socket id and mark them as offline
    const userId = Object.keys(users).find(key => users[key] === socket.id);
    if (userId) {
      delete users[userId];
      io.emit('user_status', { userId, status: 'offline' });
      console.log('User disconnected:', userId);
    }
  });
});

// Connect to MongoDB
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app';
// mongoose.connect(MONGO_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Failed to connect to MongoDB:', err));


const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/chat-app';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});