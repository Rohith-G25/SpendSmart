import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, AlertCircle, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [feedback, setFeedback] = useState({
    type: '', // 'success' or 'error'
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: '', message: '' });
    }, 4500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      if (!formData.name || !formData.email || !formData.password) {
        showFeedback('error', 'Hold up, fill in all fields bestie! 💅');
        setLoading(false);
        return;
      }
      const res = await register(formData.name, formData.email, formData.password);
      if (res.success) {
        showFeedback('success', 'Account created! Welcome to the club ✨');
        setTimeout(() => navigate('/'), 1000);
      } else {
        showFeedback('error', res.message);
      }
    } else {
      if (!formData.email || !formData.password) {
        showFeedback('error', 'Email and password are required, don\'t be shy! 💅');
        setLoading(false);
        return;
      }
      const res = await login(formData.email, formData.password);
      if (res.success) {
        showFeedback('success', 'We\'re in! Welcome back, bestie 💅');
        setTimeout(() => navigate('/'), 1000);
      } else {
        showFeedback('error', res.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-purple/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl -z-10" />

      {/* Main Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card p-8 relative shadow-glass"
      >
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Sparkles className="text-neon-pink animate-spin" style={{ animationDuration: '4s' }} size={32} />
            <h1 className="font-display font-extrabold text-3xl tracking-tight text-white">
              Spend<span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-pink">Smart</span>
            </h1>
          </div>
          <p className="text-dark-muted font-medium text-sm">
            Track your coins, don't be broke 💸
          </p>
        </div>

        {/* Auth Toggle */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 relative">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setFeedback({ type: '', message: '' });
            }}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 relative z-10 ${
              !isRegister ? 'text-white' : 'text-dark-muted'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setFeedback({ type: '', message: '' });
            }}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 relative z-10 ${
              isRegister ? 'text-white' : 'text-dark-muted'
            }`}
          >
            Sign Up
          </button>
          
          {/* Active background indicator bar */}
          <motion.div
            className="absolute top-1 bottom-1 left-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl"
            animate={{
              left: isRegister ? '50%' : '4px',
              width: 'calc(50% - 5px)'
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{ height: 'calc(100% - 8px)' }}
          />
        </div>

        {/* Action feedback toasts */}
        <AnimatePresence mode="wait">
          {feedback.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-3 p-4 rounded-xl mb-6 text-sm ${
                feedback.type === 'success' 
                  ? 'bg-neon-green/10 border border-neon-green/30 text-neon-green'
                  : 'bg-neon-rose/10 border border-neon-rose/30 text-neon-rose'
              }`}
            >
              {feedback.type === 'success' ? <Smile size={18} /> : <AlertCircle size={18} />}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {isRegister && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-dark-muted">Your Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-dark-muted" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Chad"
                  className="w-full glass-input !pl-12"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-dark-muted">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-dark-muted" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@email.com"
                className="w-full glass-input !pl-12"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-dark-muted">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-dark-muted" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full glass-input !pl-12"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gradient-btn py-4 mt-4 w-full flex items-center justify-center font-bold text-sm tracking-wide shadow-neon-pink/20"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              isRegister ? 'Create Account ✨' : 'Let\'s go! 🚀'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
