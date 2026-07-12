import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Trash2, 
  AlertOctagon, 
  ArrowRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import AddEditTransactionModal from '../components/AddEditTransactionModal';

const Dashboard = () => {
  const { user, currencySymbol } = useContext(AuthContext);
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totals, setTotals] = useState({ balance: 0, income: 0, expense: 0 });

  // Load transactions on load
  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data.data);
    } catch (err) {
      console.error(err);
      triggerToast('Could not fetch latest cash flows 💀', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate stats whenever transactions change
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalIncomeOverall = 0;
    let totalExpenseOverall = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const isCurrentMonth = txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;

      if (tx.type === 'income') {
        totalIncomeOverall += tx.amount;
        if (isCurrentMonth) monthlyIncome += tx.amount;
      } else {
        totalExpenseOverall += tx.amount;
        if (isCurrentMonth) monthlyExpense += tx.amount;
      }
    });

    setTotals({
      balance: totalIncomeOverall - totalExpenseOverall,
      income: monthlyIncome,
      expense: monthlyExpense
    });
  }, [transactions]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const handleSaveTransaction = (newTx, message, isEdit) => {
    triggerToast(message, 'success');
    fetchTransactions(); // reload all data
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Delete this cash flow bestie? 💅')) return;
    try {
      const res = await api.delete(`/transactions/${id}`);
      if (res.data.success) {
        triggerToast(res.data.message, 'success');
        setTransactions(prev => prev.filter(t => t._id !== id));
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to drop transaction 💀', 'error');
    }
  };

  // 1. Data transformation for Category Donut Chart (Current Month Expenses)
  const getPieData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categoryMap = {};
    transactions
      .filter(tx => tx.type === 'expense' && new Date(tx.date).getMonth() === currentMonth && new Date(tx.date).getFullYear() === currentYear)
      .forEach(tx => {
        const catName = tx.category?.name || 'Uncategorized';
        const catColor = tx.category?.color || '#a855f7';
        if (!categoryMap[catName]) {
          categoryMap[catName] = { name: catName, value: 0, color: catColor };
        }
        categoryMap[catName].value += tx.amount;
      });

    return Object.values(categoryMap);
  };

  const pieData = getPieData();

  // 2. Data transformation for 7-Day Spending Area Chart
  const getTrendData = () => {
    const trendMap = {};
    // Seed last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      trendMap[dateStr] = { date: dateStr, amount: 0 };
    }

    // Populate actual data
    transactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        const dateStr = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (trendMap[dateStr] !== undefined) {
          trendMap[dateStr].amount += tx.amount;
        }
      });

    return Object.values(trendMap);
  };

  const trendData = getTrendData();

  // Overspending check
  const isOverspending = totals.balance < 0 || (totals.expense > totals.income && totals.income > 0);

  // Format numbers
  const formatNum = (num) => {
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
            <Sparkles className="text-neon-pink" size={18} />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl tracking-tight text-white">
              Hey, <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-pink">{user?.name || 'Bestie'}</span> 👋
            </h1>
            <p className="text-dark-muted font-medium mt-1">Let's check your cash status.</p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="gradient-btn px-6 py-4 flex items-center gap-2 font-bold text-sm"
          >
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Overspending Banner Alert */}
        {isOverspending && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full bg-neon-rose/15 border-2 border-neon-rose/30 rounded-3xl p-5 flex items-center gap-4 shadow-neon-pink/5"
          >
            <div className="p-3 bg-neon-rose/25 rounded-2xl text-neon-rose">
              <AlertOctagon size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-base">bro your wallet said 'not today' 💀</h4>
              <p className="text-dark-muted text-xs mt-0.5">Either your balance went red or you spent more than your income this month. Lock it down! 🔒</p>
            </div>
          </motion.div>
        )}

        {/* Overview Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Balance Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col justify-between h-44 relative overflow-hidden group transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/10 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="flex justify-between items-center text-dark-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Total Balance</span>
              <Wallet size={20} className="text-neon-purple" />
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <h2 className="font-display font-extrabold text-3xl text-white tracking-tight">
                {totals.balance < 0 ? '-' : ''}{currencySymbol}{formatNum(Math.abs(totals.balance))}
              </h2>
              <span className="text-xs text-dark-muted">Across all records</span>
            </div>
          </motion.div>

          {/* Income Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col justify-between h-44 relative overflow-hidden group transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/10 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="flex justify-between items-center text-dark-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Income (This Month)</span>
              <TrendingUp size={20} className="text-neon-green" />
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <h2 className="font-display font-extrabold text-3xl text-white tracking-tight">
                {currencySymbol}{formatNum(totals.income)}
              </h2>
              <span className="text-xs text-neon-green font-semibold">Ka-ching! ✨</span>
            </div>
          </motion.div>

          {/* Expenses Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col justify-between h-44 relative overflow-hidden group transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-pink/10 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="flex justify-between items-center text-dark-muted">
              <span className="text-xs font-bold uppercase tracking-wider">Expenses (This Month)</span>
              <TrendingDown size={20} className="text-neon-pink" />
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <h2 className="font-display font-extrabold text-3xl text-white tracking-tight">
                {currencySymbol}{formatNum(totals.expense)}
              </h2>
              <span className="text-xs text-neon-pink font-semibold">Spent 💸</span>
            </div>
          </motion.div>
        </div>

        {/* Charts & Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Trend Area Chart (Lg 3 cols) */}
          <div className="glass-card p-6 lg:col-span-3 flex flex-col justify-between h-[360px]">
            <div className="mb-4">
              <h3 className="font-display font-bold text-lg text-white">Spending Trend</h3>
              <p className="text-dark-muted text-xs">Expense flow over the last 7 active days</p>
            </div>
            
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 20, 35, 0.9)', 
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#trendColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Donut Chart (Lg 2 cols) */}
          <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between h-[360px]">
            <div>
              <h3 className="font-display font-bold text-lg text-white">By Category</h3>
              <p className="text-dark-muted text-xs font-semibold">Monthly expenses share</p>
            </div>

            <div className="w-full h-48 relative flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => `${currencySymbol}${formatNum(val)}`}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 20, 35, 0.9)', 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-dark-muted">
                  <Inbox size={32} className="opacity-40" />
                  <span className="text-xs">No monthly expenses bestie 🌿</span>
                </div>
              )}
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center max-h-[80px] overflow-y-auto pt-2 border-t border-dark-border">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-white">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium truncate max-w-[80px]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Recent Moves</h3>
              <p className="text-dark-muted text-xs">Last 5 actions you made</p>
            </div>
            
            <Link 
              to="/transactions" 
              className="text-neon-purple hover:text-white transition-colors text-xs font-bold flex items-center gap-1 hover:underline"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <span className="w-8 h-8 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                <p className="text-2xl">🌱</p>
                <p className="text-dark-muted font-bold text-sm">No transactions yet bestie, go touch some grass 🌱</p>
              </div>
            ) : (
              transactions.slice(0, 5).map((tx) => (
                <div 
                  key={tx._id}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-dark-border group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${tx.category?.color || '#a855f7'}20` }}
                    >
                      {tx.category?.icon || '🏷️'}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-white truncate text-sm">
                        {tx.note || tx.category?.name || 'Untitled'}
                      </span>
                      <span className="text-xs text-dark-muted">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-neon-green' : 'text-neon-rose'}`}>
                      {tx.type === 'income' ? '+' : '-'}{currencySymbol}{formatNum(tx.amount)}
                    </span>
                    <button
                      onClick={() => handleDeleteTransaction(tx._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-dark-muted hover:text-neon-rose rounded-lg hover:bg-white/5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Floating Plus button on mobile */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white shadow-neon-pink/30 shadow-lg z-30 scale-100 hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus size={24} />
      </button>

      {/* Transaction Modal */}
      <AddEditTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  );
};

export default Dashboard;
