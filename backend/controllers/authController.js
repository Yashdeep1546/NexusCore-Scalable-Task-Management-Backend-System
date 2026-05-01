const bcrypt = require('bcryptjs'); const prisma = require('../config/db'); const generateToken = require('../utils/generateToken');
exports.register = async (req, res, next) => { 
  const { email, password, role } = req.body; 
  try { 
    const user = await prisma.user.create({ data: { email, password_hash: await bcrypt.hash(password, 10), role } }); 
    const token = generateToken(user.id, user.role);
    console.log("GENERATED TOKEN:", token);
    res.status(201).json({ token }); 
  } catch (e) { 
    // Handle Prisma unique constraint violation (P2002) specifically
    if (e.code === 'P2002') {
      return res.status(400).json({ error: 'User already exists' });
    }
    next(e); // Pass other errors to the global error handler
  } 
};

exports.login = async (req, res, next) => { 
  try {
    const { email, password } = req.body; 
    const user = await prisma.user.findUnique({ where: { email } }); 
    if (user && await bcrypt.compare(password, user.password_hash)) {
      const token = generateToken(user.id, user.role);
      console.log("LOGIN TOKEN:", token);
      res.json({ token }); 
    } else {
      res.status(401).json({ error: 'Invalid credentials' }); 
    }
  } catch (e) {
    next(e);
  }
};
