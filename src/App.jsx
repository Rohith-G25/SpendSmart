import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TransactionHistory from './pages/TransactionHistory';
import Settings from './pages/Settings';
import Categories from './pages/Categories';

const ProtectedLayout = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-dark-muted font-bold text-sm">Getting coins in order bestie... ✨</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text relative">
      <Navbar />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route 
        path="/login" 
        element={token ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/" 
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedLayout>
            <TransactionHistory />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/categories" 
        element={
          <ProtectedLayout>
            <Categories />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedLayout>
            <Settings />
          </ProtectedLayout>
        } 
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
