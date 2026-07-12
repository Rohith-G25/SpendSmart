import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, CURRENCY_SYMBOLS } from '../context/AuthContext';
import { 
  Coins, 
  User as UserIcon, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const { user, updateCurrency, updateProfile } = useContext(AuthContext);

  const [toast, setToast] = useState({ message: '', type: '' });
  
  // Settings Form States
  const [selectedCurrency, setSelectedCurrency] = useState(user?.preferredCurrency || 'INR');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(false);

  // Sync user values if loaded late
  useEffect(() => {
    if (user) {
      setSelectedCurrency(user.preferredCurrency);
      setProfileData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  // 1. Currency update handler
  const handleCurrencyChange = async (e) => {
    const val = e.target.value;
    setSelectedCurrency(val);
    const res = await updateCurrency(val);
    if (res.success) {
      triggerToast(res.message, 'success');
    } else {
      triggerToast(res.message, 'error');
    }
  };

  // 2. Profile update handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateProfile(profileData);
    if (res.success) {
      triggerToast(res.message, 'success');
      setProfileData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: ''
      }));
    } else {
      triggerToast(res.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="lg:pl-64 min-h-screen pb-12 w-full">
      {/* Dynamic notifications toast */}
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
        
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight text-white flex items-center gap-3">
            Settings & Customization <Sparkles className="text-neon-pink" size={24} />
          </h1>
          <p className="text-dark-muted font-medium mt-1">Make SpendSmart behave just how you like it.</p>
        </div>

        {/* Currency Switcher Card */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 text-white font-bold border-b border-dark-border pb-3">
            <Coins className="text-neon-purple" size={20} />
            <h3 className="font-display text-lg">Preferred Currency</h3>
          </div>
          <p className="text-xs text-dark-muted">This switch will change the monetary visual symbol across all dashboard summaries and listings.</p>
          <div className="relative max-w-sm mt-2">
            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className="w-full glass-input appearance-none bg-dark-bg text-white"
            >
              {Object.keys(CURRENCY_SYMBOLS).map((code) => (
                <option key={code} value={code}>
                  {code} ({CURRENCY_SYMBOLS[code]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Profile Settings Card */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 text-white font-bold border-b border-dark-border pb-3">
            <UserIcon className="text-neon-purple" size={20} />
            <h3 className="font-display text-lg">Profile Details</h3>
          </div>

          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-dark-muted uppercase">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="glass-input text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-dark-muted uppercase">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="glass-input text-sm"
                  required
                />
              </div>
            </div>

            {/* Password changes */}
            <div className="border-t border-dark-border/50 pt-4 mt-2 flex flex-col gap-4">
              <h4 className="text-xs font-bold text-neon-pink uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={12} /> Change Password (Optional)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-dark-muted uppercase">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                    className="glass-input text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-dark-muted uppercase">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                    className="glass-input text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn py-3.5 px-6 self-start mt-2 text-xs font-bold"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Save Profile Settings'
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Settings;
