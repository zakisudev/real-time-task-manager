const Task = require('../models/Task');

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving tasks',
      error: error.message 
    });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || ''
    });

    const savedTask = await task.save();
    
    // Broadcast to all connected clients
    req.io.emit('taskAdded', savedTask);
    
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating task',
      error: error.message 
    });
  }
};

// Update an existing task
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const taskId = req.params.id;

    // Find task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields if provided
    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({ message: 'Title cannot be empty' });
      }
      task.title = title.trim();
    }
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) {
      if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      task.status = status;
    }

    const updatedTask = await task.save();
    
    // Broadcast update to all clients
    req.io.emit('taskUpdated', updatedTask);
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating task',
      error: error.message 
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const task = await Task.findOneAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Broadcast deletion to all clients
    req.io.emit('taskDeleted', { id: taskId });
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting task',
      error: error.message 
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};