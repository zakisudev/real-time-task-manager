require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/tasks');
const { createTask, updateTask, deleteTask } = require('./controllers/taskController');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Socket.io middleware to make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/tasks', taskRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('addTask', async (task) => {
    try {
      const req = { body: task, io };
      const res = {
        status: (statusCode) => ({
          json: (data) => {
            if (statusCode !== 201) {
              console.error('Error saving task:', data);
            }
          }
        })
      };
      await createTask(req, res);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  });

  socket.on('updateTask', async (task) => {
    try {
      const req = { params: { id: task._id }, body: task, io };
      const res = {
        status: (statusCode) => ({
          json: (data) => {
            if (statusCode === 200) {
              io.emit('taskUpdated', data);
            } else {
              console.error('Error updating task:', data);
            }
          }
        })
      };
      await updateTask(req, res);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  });

  socket.on('deleteTask', async (taskId) => {
    try {
      const req = { params: { id: taskId }, io };
      const res = {
        status: (statusCode) => ({
          json: (data) => {
            if (statusCode === 200) {
              io.emit('taskDeleted', taskId);
            } else {
              console.error('Error deleting task:', data);
            }
          }
        })
      };
      await deleteTask(req, res);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});