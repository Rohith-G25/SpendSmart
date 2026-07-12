import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Tags, 
  Sparkles, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  XCircle,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJI_OPTIONS = [
  '🍔', '🛍️', '🔌', '🍿', '✈️', '💰', '🏠', '🚗', '💊', 
  '🎓', '🏋️', '🐾', '🎁', '🎮', '☕', '🧴', '💼', '📈',
  '🎸', '💅', '💈', '🍕', '🍻', '🎟️', '🛒', '🧼', '🚕'
];

const PRESET_COLORS = [
  '#ff4d4d', '#4d96ff', '#6bcb77', '#ffd93d', '#b983ff',
  '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#95a5a6'
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  
  // Category Form State
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('🍔');
  const [categoryColor, setCategoryColor] = useState('#ff4d4d');
  const [categoryType, setCategoryType] = useState('expense');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
      triggerToast('Could not fetch categories 💀', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      triggerToast('Enter a category name, bestie! 💅', 'error');
      return;
    }

    try {
      const res = await api.post('/categories', {
        name: categoryName,
        icon: categoryIcon,
        color: categoryColor,
        type: categoryType
      });

      if (res.data.success) {
        triggerToast(res.data.message, 'success');
        setCategoryName('');
        fetchCategories();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Failed to create category 💀', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        triggerToast(res.data.message, 'success');
        setCategories(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Could not delete category 💀', 'error');
    }
  };

  const handleSeedDefaults = async () => {
    setLoading(true);
    try {
      const res = await api.post('/categories/seed');
      if (res.data.success) {
        triggerToast(res.data.message, 'success');
        fetchCategories();
      }
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Seeding failed 💀', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:pl-64 min-h-screen pb-12 w-full">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border text-sm ${
              toast.type === 'error'
                ? 'bg-neon-rose/90 text-white border-neon-rose'
                : 'bg-dark-card text-white border-neon-purple/30'
            }`}
          >
            {toast.type === 'error' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl tracking-tight text-white flex items-center gap-3">
              Categories Room <Tags className="text-neon-purple" size={24} />
            </h1>
            <p className="text-dark-muted font-medium mt-1">Design the labels for your coin flow.</p>
          </div>

          <button
            onClick={handleSeedDefaults}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-neon-purple/40 bg-neon-purple/10 text-white hover:bg-neon-purple/20 transition-all font-bold text-xs shadow-neon-purple/5"
          >
            <Sparkles className="text-neon-pink" size={14} />
            <span>{loading ? 'Seeding...' : 'Load defaults bestie ✨'}</span>
          </button>
        </div>

        {/* Creation Form Card */}
        <div className="glass-card p-6">
          <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
            <h3 className="font-display text-lg text-white font-bold border-b border-dark-border pb-3">Create Custom Category</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-dark-muted uppercase">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Starbucks, Uber..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="glass-input py-2.5 text-sm"
                  required
                />
              </div>

              {/* Category Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-dark-muted uppercase">Type</label>
                <select
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  className="glass-input py-2.5 text-sm appearance-none bg-dark-bg"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {/* Color selector picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-dark-muted uppercase">Custom Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={categoryColor}
                    onChange={(e) => setCategoryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <div className="flex gap-1 overflow-x-auto py-1">
                    {PRESET_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setCategoryColor(col)}
                        className={`w-5 h-5 rounded-full shrink-0 border border-white/20 transition-transform ${categoryColor === col ? 'scale-125 border-white' : ''}`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Emoji Selector Panel */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-[11px] font-bold text-dark-muted uppercase">Select Emoji Icon ({categoryIcon})</label>
              <div className="flex flex-wrap gap-2 max-h-[92px] overflow-y-auto p-2.5 bg-dark-bg/60 rounded-xl border border-dark-border">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setCategoryIcon(emoji)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-white/10 transition-colors ${categoryIcon === emoji ? 'bg-neon-purple/30 border border-neon-purple/50' : ''}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="gradient-btn py-3.5 mt-2 self-start px-6 text-xs font-bold"
            >
              <Plus className="inline mr-1" size={14} /> Add Category
            </button>
          </form>
        </div>

        {/* Categories Grid List */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <h3 className="font-display text-lg text-white font-bold border-b border-dark-border pb-3">Your Categories</h3>
          
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Inbox className="text-dark-muted opacity-40 animate-pulse" size={32} />
              <p className="text-xs text-dark-muted">No categories loaded yet. Seed defaults above bestie! 💅</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-dark-border hover:border-dark-border/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      {cat.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-semibold">{cat.name}</span>
                      <span className="text-[10px] text-dark-muted uppercase tracking-wider font-bold">{cat.type}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="p-2 text-dark-muted hover:text-neon-rose rounded-lg hover:bg-white/5 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Categories;
