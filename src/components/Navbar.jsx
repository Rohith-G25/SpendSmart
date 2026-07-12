import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Settings as SettingsIcon, 
  LogOut, 
  Sparkles,
  Menu,
  X,
  Tags
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <ReceiptText size={20} /> },
    { name: 'Categories', path: '/categories', icon: <Tags size={20} /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={20} /> },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="lg:hidden w-full bg-dark-bg/80 backdrop-blur-md border-b border-dark-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="text-neon-pink" size={24} />
          <span className="font-display font-bold text-xl tracking-tight text-glow-pink">
            Spend<span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-pink">Smart</span>
          </span>
        </div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-neon-purple transition-colors p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-dark-bg/50 border-r border-dark-border p-6 justify-between z-40 backdrop-blur-lg">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <Sparkles className="text-neon-purple animate-pulse" size={28} />
            <span className="font-display font-extrabold text-2xl tracking-tight">
              Spend<span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-pink">Smart</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 relative ${
                    isActive 
                      ? 'text-white shadow-neon-purple/20 shadow-md border-l-4 border-neon-purple bg-gradient-to-r from-neon-purple/20 to-transparent' 
                      : 'text-dark-muted hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User profile details and Logout */}
        <div className="flex flex-col gap-4 border-t border-dark-border pt-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center font-bold text-white uppercase text-glow-pink">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm truncate text-white">{user?.name}</span>
              <span className="text-xs text-dark-muted truncate">{user?.email}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-neon-rose hover:bg-neon-rose/10 transition-all duration-300 w-full"
          >
            <LogOut size={20} />
            <span>Logout bestie 💅</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed top-0 left-0 bottom-0 w-72 bg-dark-bg border-r border-dark-border p-6 flex flex-col justify-between z-50 lg:hidden"
            >
              <div className="flex flex-col gap-8">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between border-b border-dark-border pb-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-neon-purple" size={24} />
                    <span className="font-display font-bold text-xl tracking-tight">
                      Spend<span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-pink">Smart</span>
                    </span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-dark-muted hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                {/* Nav list */}
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 ${
                          isActive 
                            ? 'text-white border-l-4 border-neon-purple bg-gradient-to-r from-neon-purple/20 to-transparent' 
                            : 'text-dark-muted hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              {/* User bottom info in drawer */}
              <div className="flex flex-col gap-4 border-t border-dark-border pt-6">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center font-bold text-white uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm truncate text-white">{user?.name}</span>
                    <span className="text-xs text-dark-muted truncate">{user?.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl font-medium text-neon-rose hover:bg-neon-rose/10 transition-all duration-300 w-full"
                >
                  <LogOut size={20} />
                  <span>Logout bestie 💅</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
