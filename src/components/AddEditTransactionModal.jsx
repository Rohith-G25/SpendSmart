import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { X, DollarSign, Calendar, FileText, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddEditTransactionModal = ({ isOpen, onClose, onSave, transaction = null }) => {
  const { currencySymbol } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories on open to populate dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Set form fields if editing a transaction
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category._id || transaction.category,
        date: new Date(transaction.date).toISOString().split('T')[0],
        note: transaction.note || '',
      });
    } else {
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
    }
    setError('');
  }, [transaction, isOpen]);

  // Sync category filter by transaction type
  const filteredCategories = categories.filter((cat) => cat.type === formData.type);

  // Auto-select first matching category when type changes
  useEffect(() => {
    if (filteredCategories.length > 0) {
      // Only auto-select if current category is empty or does not belong to new type
      const isCurrentCatValid = filteredCategories.some(c => c._id === formData.category);
      if (!isCurrentCatValid) {
        setFormData(prev => ({ ...prev, category: filteredCategories[0]._id }));
      }
    } else {
      setFormData(prev => ({ ...prev, category: '' }));
    }
  }, [formData.type, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.amount || formData.amount <= 0) {
      setError('Enter a valid amount, don\'t play around! 💸');
      setLoading(false);
      return;
    }

    if (!formData.category) {
      setError('Please pick a category bestie! 💅');
      setLoading(false);
      return;
    }

    try {
      let res;
      if (transaction) {
        // Edit mode
        res = await api.put(`/transactions/${transaction._id}`, formData);
      } else {
        // Add mode
        res = await api.post('/transactions', formData);
      }
      
      if (res.data.success) {
        onSave(res.data.data, res.data.message, !!transaction);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction save failed, try again 💀');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="w-full max-w-md glass-card glass-modal p-6 relative shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-dark-border pb-4 mb-6">
            <h2 className="font-display font-bold text-xl text-white">
              {transaction ? 'Revamp Transaction 🚀' : 'Add Some Coins ✨'}
            </h2>
            <button onClick={onClose} className="text-dark-muted hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-neon-rose/10 border border-neon-rose/30 text-neon-rose p-3.5 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-dark-muted">Amount ({currencySymbol})</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-dark-muted font-bold text-lg">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full glass-input !pl-10 text-lg font-bold"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Transaction Type */}
            <div className="flex bg-white/5 p-1 rounded-xl relative">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 z-10 ${
                  formData.type === 'expense' ? 'text-white' : 'text-dark-muted'
                }`}
              >
                Expense 💸
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 z-10 ${
                  formData.type === 'income' ? 'text-white' : 'text-dark-muted'
                }`}
              >
                Income 💰
              </button>
              <motion.div
                className={`absolute top-1 bottom-1 left-1 rounded-lg ${
                  formData.type === 'expense' ? 'bg-neon-rose/80' : 'bg-neon-green/80'
                }`}
                animate={{
                  left: formData.type === 'income' ? '50%' : '4px',
                  width: 'calc(50% - 5px)'
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            </div>

            {/* Category selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-dark-muted">Category</label>
              <div className="relative">
                <Tag className="absolute left-4 top-3.5 text-dark-muted" size={16} />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full glass-input !pl-10 appearance-none bg-dark-bg text-white"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                {filteredCategories.length === 0 && (
                  <p className="text-xs text-neon-yellow mt-1">
                    No categories found for this type. Create some in Settings! ⚙️
                  </p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-dark-muted">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-dark-muted" size={16} />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full glass-input !pl-10"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-dark-muted">Notes / Details</label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 text-dark-muted" size={16} />
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="e.g. Starbucks iced latte ☕"
                  className="w-full glass-input !pl-10"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl border border-dark-border text-white text-xs font-bold hover:bg-white/5 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 gradient-btn py-3.5 text-xs font-bold"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                  transaction ? 'Update' : 'Save ✨'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddEditTransactionModal;
