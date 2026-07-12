import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Search, 
  Trash2, 
  Edit2, 
  Sparkles, 
  Filter, 
  X,
  Inbox,
  ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddEditTransactionModal from '../components/AddEditTransactionModal';

const TransactionHistory = () => {
  const { currencySymbol } = useContext(AuthContext);

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });
  
  // Filters state
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [visibleCount, setVisibleCount] = useState(10);

  // Modal target
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Fetch categories to populate filters dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch transactions based on current filters
  const fetchFilteredTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (type) params.type = type;
      if (category) params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/transactions', { params });
      setTransactions(res.data.data);
    } catch (err) {
      console.error(err);
      triggerToast('Could not reload transactions 💀', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger search / filters fetch on change (with a debounce logic or standard useEffect)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchFilteredTransactions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, type, category, startDate, endDate]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const handleSaveTransaction = (savedTx, message, isEdit) => {
    triggerToast(message, 'success');
    fetchFilteredTransactions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cash flow record bestie? 💅')) return;
    try {
      const res = await api.delete(`/transactions/${id}`);
      if (res.data.success) {
        triggerToast(res.data.message, 'success');
        setTransactions(prev => prev.filter(t => t._id !== id));
      }
    } catch (err) {
      console.error(err);
      triggerToast('Delete failed, stay strong 💀', 'error');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setType('');
    setCategory('');
    setStartDate('');
    setEndDate('');
  };

  const formatNum = (num) => {
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="lg:pl-64 min-h-screen pb-12 w-full">
      {/* Toast popup */}
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
            <Sparkles className="text-neon-pink" size={18} />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl tracking-tight text-white flex items-center gap-3">
              Transaction History <ArrowRightLeft className="text-neon-purple" size={24} />
            </h1>
            <p className="text-dark-muted font-medium mt-1">Receipts, bills, income, details. It's all here.</p>
          </div>
          
          <button
            onClick={() => {
              setEditTarget(null);
              setIsModalOpen(true);
            }}
            className="gradient-btn px-6 py-4 flex items-center gap-2 font-bold text-sm"
          >
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Filter Controls Grid */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Filter size={16} className="text-neon-purple" />
            <span>Filters & Search</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-dark-muted" size={16} />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full glass-input !pl-9 py-2.5 text-sm"
              />
            </div>

            {/* Type */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="glass-input py-2.5 text-sm appearance-none bg-dark-bg text-white"
            >
              <option value="">All Types 💸</option>
              <option value="expense">Expense 📉</option>
              <option value="income">Income 📈</option>
            </select>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="glass-input py-2.5 text-sm appearance-none bg-dark-bg text-white"
            >
              <option value="">All Categories 🏷️</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name} ({cat.type})
                </option>
              ))}
            </select>

            {/* Start Date */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              className="glass-input py-2.5 text-sm"
            />

            {/* End Date */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              className="glass-input py-2.5 text-sm"
            />
          </div>

          {/* Reset Filters */}
          {(search || type || category || startDate || endDate) && (
            <button
              onClick={clearFilters}
              className="self-end flex items-center gap-1 text-xs text-neon-rose font-bold hover:underline"
            >
              <X size={12} />
              <span>Clear all filters</span>
            </button>
          )}
        </div>

        {/* Transaction Listings */}
        <div className="glass-card p-6 flex flex-col gap-4">
          {loading && transactions.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
              <Inbox size={48} className="text-dark-muted opacity-40 animate-bounce" />
              <p className="text-dark-muted font-bold text-sm">No transactions matched your criteria bestie! 🌿</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {transactions.slice(0, visibleCount).map((tx) => (
                <div 
                  key={tx._id}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-dark-border transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-inner"
                      style={{ backgroundColor: `${tx.category?.color || '#a855f7'}20` }}
                    >
                      {tx.category?.icon || '🏷️'}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-white truncate text-sm">
                        {tx.note || tx.category?.name || 'Untitled'}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span 
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-white/90"
                          style={{ backgroundColor: tx.category?.color || '#a855f7' }}
                        >
                          {tx.category?.name || 'Uncategorized'}
                        </span>
                        <span className="text-[11px] text-dark-muted">
                          {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Value */}
                  <div className="flex items-center gap-4">
                    <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-neon-green' : 'text-neon-rose'}`}>
                      {tx.type === 'income' ? '+' : '-'}{currencySymbol}{formatNum(tx.amount)}
                    </span>
                    
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditTarget(tx);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-dark-muted hover:text-neon-purple rounded-lg hover:bg-white/5"
                        title="Edit entry"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="p-2 text-dark-muted hover:text-neon-rose rounded-lg hover:bg-white/5"
                        title="Delete entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {transactions.length > visibleCount && (
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="mt-4 self-center px-6 py-3 border border-dark-border rounded-xl text-xs font-bold text-dark-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Add/Edit Modal */}
      <AddEditTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSaveTransaction}
        transaction={editTarget}
      />
    </div>
  );
};

export default TransactionHistory;
