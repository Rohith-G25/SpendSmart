const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Please add an icon'],
      default: '📦',
    },
    color: {
      type: String,
      required: [true, 'Please add a color'],
      default: '#a855f7', // default purple
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      default: 'expense',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate categories for the same user
CategorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);
