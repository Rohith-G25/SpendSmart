const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Update preferred currency
// @route   PUT /api/settings/currency
// @access  Private
const updateCurrency = async (req, res) => {
  try {
    const { preferredCurrency } = req.body;

    if (!preferredCurrency) {
      return res.status(400).json({ success: false, message: 'Please specify your preferred currency bestie! 💅' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferredCurrency },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
      message: `Currency switched to ${preferredCurrency}! 💸`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, could not update currency 💀' });
  }
};

// @desc    Update user profile
// @route   PUT /api/settings/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found 🕵️‍♂️' });
    }

    // Update name
    if (name) {
      user.name = name;
    }

    // Update email
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'That email is already taken, pick another one! ✨' });
      }
      user.email = email;
    }

    // Password change logic
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Need your current password to set a new one! 🔒' });
      }

      // Check current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect bro 💀' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters! 🔒' });
      }

      // Hash and set
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated! Looking fresh 💅',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, could not update profile 💀' });
  }
};

module.exports = {
  updateCurrency,
  updateProfile,
};
