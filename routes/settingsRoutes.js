const express = require('express');
const router = express.Router();
const { updateCurrency, updateProfile } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect settings routes

router.put('/currency', updateCurrency);
router.put('/profile', updateProfile);

module.exports = router;
