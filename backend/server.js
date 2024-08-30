
const express = require('express');
const http = require('http');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const { Server } = require('socket.io');

const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',  // Local development
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions)); 

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

app.use(express.static('public'));

const users = {};  // Object to keep track of users and their rooms

io.on('connection', (socket) => {
  //console.log('New client connected');

  // Handle joining a room
  socket.on('joinRoom', (roomId, username) => {
    socket.join(roomId);
    console.log(`${username} joined room`);

    // Keep track of the user in the room
    users[socket.id] = { username, roomId };
    //console.log(users);

    // Notify others in the room
    socket.to(roomId).emit('receiveMessage', { username: 'System', message: `${username} has joined the chat` , timeStamp:new Date().toLocaleTimeString()});
  });

  // Handle incoming messages
  socket.on('sendMessage', (messageData) => {
    const { roomId } = users[socket.id] || {};
    if (roomId) {
      const timestamp=new Date().toLocaleTimeString();
      io.to(roomId).emit('receiveMessage', {...messageData,timestamp});
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      const { username, roomId } = user;
      //console.log(`${username} disconnected`);

      // Notify others in the room
      io.to(roomId).emit('receiveMessage', { username: 'System', message: `${username} has left the chat`,timeStamp:new Date().toLocaleTimeString() });

      // Clean up the user tracking
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
