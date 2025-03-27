const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

// Get all todos for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching todos for user:', req.user._id);
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log(`Found ${todos.length} todos`);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating new todo:', req.body);
    const { title } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = new Todo({
      title: title.trim(),
      completed: false,
      inTrash: false,
      user: req.user._id
    });

    await todo.save();
    console.log('Todo created successfully:', todo);
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(400).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
router.patch('/:id', auth, async (req, res) => {
  try {
    console.log('Updating todo:', req.params.id);
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      console.log('Todo not found:', req.params.id);
      return res.status(404).json({ error: 'Todo not found' });
    }

    Object.assign(todo, req.body);
    await todo.save();
    console.log('Todo updated successfully:', todo);
    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(400).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting todo:', req.params.id);
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      console.log('Todo not found:', req.params.id);
      return res.status(404).json({ error: 'Todo not found' });
    }
    console.log('Todo deleted successfully:', todo);
    res.json(todo);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router; 