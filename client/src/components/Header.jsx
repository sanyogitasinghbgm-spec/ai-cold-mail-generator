import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, LogOut, LayoutDashboard, User, ArrowRight } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-cosmic-bg/70 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative p-2 bg-gradient-to-tr from-brand-600 to-pink-600 rounded-xl shadow-glow-primary group-hover:scale-105 transition-transform duration-300">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Cold<span className="text-brand-400 font-extrabold">Mail</span>.ai
            </span>
          </Link>

          {/* Navigation Actions */}
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                {/* Profile Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                    <User className="h-3 w-3 text-brand-400" />
                  </div>
                  <span className="text-xs font-semibold text-gray-300 hidden md:inline truncate max-w-[120px]">
                    {user?.name || 'User'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 sm:px-4 sm:py-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-gray-400 border border-white/10 hover:border-red-500/20 transition-all duration-300 flex items-center gap-2"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center gap-1.5"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </nav>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
