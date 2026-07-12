const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

// @desc    Get user categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user._id });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, failed to load categories 💀' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const { name, icon, color, type } = req.body;

    if (!name || !icon || !color) {
      return res.status(400).json({ success: false, message: 'Give your category a name, icon, and color, bestie! 💅' });
    }

    // Check if category already exists for user (case insensitive + check type)
    const existingCategory = await Category.findOne({
      userId: req.user._id,
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      type: type || 'expense'
    });

    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'This category already exists, try a different name! ✨' });
    }

    const category = await Category.create({
      userId: req.user._id,
      name,
      icon,
      color,
      type: type || 'expense'
    });

    res.status(201).json({ success: true, data: category, message: 'Category added! Lookin\' good 💅' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, could not create category 💀' });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const { name, icon, color, type } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found 🕵️‍♂️' });
    }

    // Make sure category belongs to user
    if (category.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to edit this category 💀' });
    }

    // Check name collision if name changed
    if (name && name.toLowerCase() !== category.name.toLowerCase()) {
      const collision = await Category.findOne({
        userId: req.user._id,
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        type: type || category.type
      });
      if (collision) {
        return res.status(400).json({ success: false, message: 'Another category has this name already! ✨' });
      }
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, icon, color, type },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: category, message: 'Category updated successfully! 🚀' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, could not update category 💀' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found 🕵️‍♂️' });
    }

    // Make sure category belongs to user
    if (category.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this category 💀' });
    }

    // Check if category is used in any transactions
    const usedCount = await Transaction.countDocuments({ category: req.params.id });
    if (usedCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete bestie! This category is used in ${usedCount} transaction(s). Update or delete them first 💅`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {}, message: 'Category deleted! Out of sight, out of mind 💅' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, could not delete category 💀' });
  }
};

// @desc    Seed default categories for a user
// @route   POST /api/categories/seed
// @access  Private
const seedCategories = async (req, res) => {
  try {
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

    let seededCount = 0;
    for (const cat of defaultCategories) {
      // Check if category name already exists for user
      const exists = await Category.findOne({
        userId: req.user._id,
        name: { $regex: new RegExp(`^${cat.name}$`, 'i') },
        type: cat.type
      });

      if (!exists) {
        await Category.create({
          ...cat,
          userId: req.user._id
        });
        seededCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: seededCount > 0 
        ? `Ka-ching! Added ${seededCount} default categories ✨` 
        : 'All default categories already exist, bestie! 💅',
      count: seededCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, could not seed categories 💀' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
};
