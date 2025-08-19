import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const socket = io('http://localhost:5000');

function App() {
  const [tasks, setTasks] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchtasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/tasks');
        const data = res.data;
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchtasks();

    // Socket event listeners
    socket.on('taskAdded', (task) => {
      setTasks((prev) => [...prev, task]);
      showNotification('Task added successfully');
    });

    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) => 
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
      showNotification('Task updated successfully');
    });

    socket.on('taskDeleted', (taskId) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      showNotification('Task deleted successfully');
    });

    return () => {
      socket.off('taskAdded');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, []);

  const showNotification = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Task Manager</h1>
        <TaskForm socket={socket} />
        <TaskList tasks={tasks} socket={socket} />
        
        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={3000} 
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)} 
            severity="success"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default App;