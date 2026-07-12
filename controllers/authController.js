const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_genz_key_1337', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Fill all fields bestie 💅' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Make password at least 6 characters, stay safe 🔒' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists, try logging in! 💅' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      // Seed default categories
      const defaultCategories = [
        { name: 'Food', icon: '🍔', color: '#ff4d4d', type: 'expense' },
        { name: 'Shopping', icon: '🛍️', color: '#4d96ff', type: 'expense' },
        { name: 'Bills', icon: '🔌', color: '#6bcb77', type: 'expense' },
        { name: 'Entertainment', icon: '🍿', color: '#ffd93d', type: 'expense' },
        { name: 'Travel', icon: '✈️', color: '#b983ff', type: 'expense' },
        { name: 'Medical', icon: '🏥', color: '#e74c3c', type: 'expense' },
        { name: 'Education', icon: '📚', color: '#3498db', type: 'expense' },
        { name: 'Fitness', icon: '🏋️', color: '#e67e22', type: 'expense' },
        { name: 'Coffee', icon: '☕', color: '#a0522d', type: 'expense' },
        { name: 'Boba', icon: '🧋', color: '#d2b48c', type: 'expense' },
        { name: 'Streaming', icon: '📺', color: '#e50914', type: 'expense' },
        { name: 'Gaming', icon: '🎮', color: '#5b92e5', type: 'expense' },
        { name: 'Groceries', icon: '🛒', color: '#2ecc71', type: 'expense' },
        { name: 'Rent', icon: '🏠', color: '#34495e', type: 'expense' },
        { name: 'Transport', icon: '🚗', color: '#f1c40f', type: 'expense' },
        { name: 'Skincare', icon: '🧴', color: '#ffb6c1', type: 'expense' },
        { name: 'Concerts', icon: '🎸', color: '#9b59b6', type: 'expense' },
        { name: 'Subscriptions', icon: '💳', color: '#34495e', type: 'expense' },
        { name: 'Gifts', icon: '🎁', color: '#e74c3c', type: 'expense' },
        { name: 'Pets', icon: '🐾', color: '#d35400', type: 'expense' },
        { name: 'Salon', icon: '💅', color: '#ff69b4', type: 'expense' },
        { name: 'Tech Gadgets', icon: '💻', color: '#1abc9c', type: 'expense' },
        { name: 'Books', icon: '📖', color: '#95a5a6', type: 'expense' },
        { name: 'Party', icon: '🍻', color: '#f39c12', type: 'expense' },
        { name: 'Charity', icon: '💝', color: '#e84393', type: 'expense' },
        { name: 'Other', icon: '🏷️', color: '#95a5a6', type: 'expense' },
        { name: 'Salary', icon: '💰', color: '#2ecc71', type: 'income' },
        { name: 'Side Hustle', icon: '🚀', color: '#10b981', type: 'income' },
        { name: 'Investments', icon: '📈', color: '#06b6d4', type: 'income' },
        { name: 'Crypto', icon: '🪙', color: '#f59e0b', type: 'income' },
        { name: 'Pocket Money', icon: '💵', color: '#2ecc71', type: 'income' },
        { name: 'Freelance', icon: '💼', color: '#9b59b6', type: 'income' }
      ];

      const categoriesToCreate = defaultCategories.map(cat => ({
        ...cat,
        userId: user._id
      }));

      await Category.insertMany(categoriesToCreate);

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        preferredCurrency: user.preferredCurrency,
        token: generateToken(user._id),
        message: 'Account created! Welcome to the club ✨'
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data received 💀' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, try again later 💀' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Enter both email and password, please 💅' });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        preferredCurrency: user.preferredCurrency,
        token: generateToken(user._id),
        message: 'We\'re in! Welcome back, bestie 💅'
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password bro 💀' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, try again later 💀' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error 💀' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
