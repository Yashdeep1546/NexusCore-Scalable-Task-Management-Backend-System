const express = require('express'); const { getProfile, getAllUsers } = require('../controllers/userController'); const { protect, admin } = require('../middleware/authMiddleware'); const router = express.Router();
router.get('/profile', protect, getProfile); router.get('/admin/users', protect, admin, getAllUsers); module.exports = router;
