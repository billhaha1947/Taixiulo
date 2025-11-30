const express = require('express');
const router = express.Router();
const { getProfile, updateAvatar, getBalance } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/profile', getProfile);
router.post('/avatar', updateAvatar);
router.get('/balance', getBalance);

module.exports = router;
