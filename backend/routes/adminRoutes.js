const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// Middleware to check if the user is an admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Administrators only.' });
  }
};

// GET all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// DELETE a user
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    // This will also delete the user's tasks if your database has cascading deletes setup
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// GET all tasks in the entire system
router.get('/tasks', protect, adminOnly, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch system tasks' });
  }
});

// DELETE any task in the system
router.delete('/tasks/:id', protect, adminOnly, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
