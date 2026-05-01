const prisma = require('../config/db');

exports.createTask = async (req, res) => {
  const { title } = req.body;
  try {
    const task = await prisma.task.create({ data: { title, userId: req.user.id } });
    res.status(201).json(task);
  } catch (error) { res.status(400).json({ error: 'Failed to create task' }); }
};

exports.getTasks = async (req, res) => {
  const tasks = await prisma.task.findMany({ where: { userId: req.user.id } });
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const task = await prisma.task.update({ where: { id, userId: req.user.id }, data: { status } });
    res.json(task);
  } catch (error) { res.status(404).json({ error: 'Task not found or unauthorized' }); }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id, userId: req.user.id } });
    res.json({ message: 'Task deleted' });
  } catch (error) { res.status(404).json({ error: 'Task not found or unauthorized' }); }
};
