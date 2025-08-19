import { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function TaskForm({ socket }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
    };

    socket.emit('addTask', newTask);
    setTitle('');
    setDescription('');
    setError('');
    setOpen(false);
  };

  return (
    <div className="mb-6">
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        className="w-full bg-accent text-white hover:bg-accent-dark"
      >
        Add New Task
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle className="bg-primary text-white">Add New Task</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="bg-secondary text-white">
            <TextField
              autoFocus
              margin="dense"
              label="Task Title"
              type="text"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!error}
              helperText={error}
              InputLabelProps={{ className: 'text-white' }}
              InputProps={{ className: 'text-white' }}
            />
            <TextField
              margin="dense"
              label="Description (optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputLabelProps={{ className: 'text-white' }}
              InputProps={{ className: 'text-white' }}
            />
          </DialogContent>
          <DialogActions className="bg-secondary text-white">
            <Button onClick={() => setOpen(false)} className="text-white">Cancel</Button>
            <Button type="submit" variant="contained" className="bg-accent text-white">Add Task</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default TaskForm;