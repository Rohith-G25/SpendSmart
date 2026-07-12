const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search } = req.query;

    const query = { userId: req.user._id };

    // Filter by type (income / expense)
    if (type && ['income', 'expense'].includes(type)) {
      query.type = type;
    }

    // Filter by category ID
    if (category) {
      query.category = category;
    }

    // Filter by Date Range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of the day (23:59:59.999) to include everything on that day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Keyword search in notes
    if (search) {
      query.note = { $regex: search, $options: 'i' };
    }

    const transactions = await Transaction.find(query)
      .populate('category', 'name icon color type')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, could not fetch transactions 💀' });
  }
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, note } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ success: false, message: 'Amount, type, and category are required bestie! 💅' });
    }

    // Verify category exists and belongs to the user
    const dbCategory = await Category.findOne({ _id: category, userId: req.user._id });
    if (!dbCategory) {
      return res.status(400).json({ success: false, message: 'Invalid category selected, try again 🕵️‍♂️' });
    }

    let transaction = await Transaction.create({
      userId: req.user._id,
      amount,
      type,
      category,
      date: date || new Date(),
      note,
    });

    transaction = await transaction.populate('category', 'name icon color type');

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Ka-ching! Transaction added ✨',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, could not add transaction 💀' });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, note } = req.body;

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found 🕵️‍♂️' });
    }

    // Verify ownership
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized 💀' });
    }

    // Verify category if changed
    if (category) {
      const dbCategory = await Category.findOne({ _id: category, userId: req.user._id });
      if (!dbCategory) {
        return res.status(400).json({ success: false, message: 'Invalid category, try again 🕵️‍♂️' });
      }
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, type, category, date, note },
      { new: true, runValidators: true }
    ).populate('category', 'name icon color type');

    res.status(200).json({
      success: true,
      data: transaction,
      message: 'Boom, transaction revamped 🚀',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, could not update transaction 💀' });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found 🕵️‍♂️' });
    }

    // Verify ownership
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized 💀' });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Deleted! We don\'t know her 💅',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, could not delete transaction 💀' });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
