const prisma = require('../config/db');
exports.getProfile = async (req, res) => res.json(req.user);
exports.getAllUsers = async (req, res) => res.json(await prisma.user.findMany({ select: { id: true, email: true, role: true } }));
