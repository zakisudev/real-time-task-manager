import { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Grid
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { format } from 'date-fns';

function TaskList({ tasks, socket }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  const handleEdit = (task) => {
    setCurrentTask(task);
    setTitle(task.title);
    setDescription(task.description); 
    setStatus(task.status);
    setEditOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updatedTask = {
      ...currentTask,
      title: title.trim(),
      description: description.trim(),
      status,
    };

    socket.emit('updateTask', updatedTask);
    setEditOpen(false);
  };

  const handleDelete = (taskId) => {
    socket.emit('deleteTask', taskId);
    setDeleteOpen(false);
  };

  const confirmDelete = (task) => {
    setCurrentTask(task);
    setDeleteOpen(true);
  };

  return (
    <div className="rounded-lg bg-background">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h6" className="text-center text-white">Pending</Typography>
          <List>
            {tasks?.filter(task => task.status === 'pending').map((task) => (
              <ListItem
                key={task._id}
                className="border-b last:border-b-0 rounded-lg mb-3 bg-linear-to-r/oklch from-red-500 to-pink-400"
                secondaryAction={
                  <div>
                    <IconButton edge="end" onClick={() => handleEdit(task)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => confirmDelete(task)}>
                      <Delete />
                    </IconButton>
                  </div>
                }
              >
                <ListItemText
                  primary={task.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: 10 }}>
                        {task.description}
                      </Typography>
                      {task.createdAt && (
                        <Typography variant="body2" color="textSecondary" className="text-xs mt-5" style={{ fontSize: 12 }}>
                          Created: {format(new Date(task.createdAt), 'MMM d, yyyy, h:mm a')}
                        </Typography>
                      )}
                      {task.updatedAt && (
                        <Typography variant="body2" color="textSecondary" className="text-xs" style={{ fontSize: 12 }}>
                          Updated: {format(new Date(task.updatedAt), 'MMM d, yyyy, h:mm a')}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" className="text-center text-white">Completed Tasks</Typography>
          <List>
            {tasks?.filter(task => task.status === 'completed').map((task) => (
              <ListItem
                key={task._id}
                className="border-b last:border-b-0 rounded-lg mb-3 bg-linear-to-r/oklch from-teal-500 to-indigo-400"
                secondaryAction={
                  <div>
                    <IconButton edge="end" onClick={() => handleEdit(task)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => confirmDelete(task)}>
                      <Delete />
                    </IconButton>
                  </div>
                }
              >
                <ListItemText
                  primary={task.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: 10 }}>
                        {task.description}
                      </Typography>
                      {task.createdAt && (
                        <Typography variant="body2" color="textSecondary" style={{ fontSize: 12 }}>
                          Created: {format(new Date(task.createdAt), 'MMM d, yyyy, h:mm a')}
                        </Typography>
                      )}
                      {task.updatedAt && (
                        <Typography variant="body2" color="textSecondary" style={{ fontSize: 12 }}>
                          Updated: {format(new Date(task.updatedAt), 'MMM d, yyyy, h:mm a')}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle className="bg-primary text-white">Edit Task</DialogTitle>
        <form onSubmit={handleUpdate}>
          <DialogContent className="bg-secondary text-white">
            <TextField
              margin="dense"
              label="Task Title"
              type="text"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputLabelProps={{ className: 'text-white' }}
              InputProps={{ className: 'text-white' }}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputLabelProps={{ className: 'text-white' }}
              InputProps={{ className: 'text-white' }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel className="text-white">Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
                className="text-white"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions className="bg-secondary text-white">
            <Button onClick={() => setEditOpen(false)} className="text-white">Cancel</Button>
            <Button type="submit" variant="contained" className="bg-accent text-white">Update Task</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle className="bg-primary text-black">Confirm Delete</DialogTitle>
        <DialogContent className="bg-secondary text-black">
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions className="bg-secondary text-black">
          <Button onClick={() => setDeleteOpen(false)} className="text-black">Cancel</Button>
          <Button onClick={() => handleDelete(currentTask._id)} variant="contained" className="bg-red-500 text-black">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskList;