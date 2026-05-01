const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  console.log("RECEIVED TOKEN:", token);
  if (!token) return res.status(401).json({ error: 'Not authorized, no token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { id: true, email: true, role: true } });
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }
    next();
  } catch (error) { 
    console.error("Token verification error:", error);
    res.status(401).json({ error: 'Token failed' }); 
  }
};

const admin = (req, res, next) => req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Admin only' });

module.exports = { protect, admin };
