import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';

// Protected Route Guard: allows access only to authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Guard: prevents logged in users from seeing login/signup/verify pages
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppContent() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-bg flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-brand-500 border-r-pink-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/verify-otp" 
              element={
                <PublicRoute>
                  <VerifyOtp />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* Redirect fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
