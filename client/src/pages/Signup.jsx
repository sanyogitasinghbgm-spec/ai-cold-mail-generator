import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader';

const Signup = () => {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await registerUser(name, email, password);
      
      setSuccessMsg(data.message || 'OTP verification code sent!');
      setLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 1500);

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Background Dot Grid Overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none z-0"></div>

      {/* Background Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {loading && <Loader message="Setting up your account..." />}

      <div className="glass-panel saas-card-glow p-8 max-w-md w-full shadow-2xl border-zinc-800/80 bg-zinc-950/75 relative z-10">
        
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl w-fit mx-auto mb-4">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-zinc-400 mt-1.5 text-xs">Start generating custom email campaigns</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 p-3.5 rounded-lg bg-red-950/30 border border-red-900/30 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-lg bg-green-950/30 border border-green-900/30 text-green-200 text-xs">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-zinc-400 mb-1.5 ml-1">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="glass-input pl-9 w-full"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-zinc-400 mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="glass-input pl-9 w-full"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-zinc-400 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="glass-input pl-9 w-full"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-6">
            Register Account
          </button>

        </form>

        {/* Footer link */}
        <p className="text-center text-xs text-zinc-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-zinc-200 hover:text-white font-medium underline underline-offset-4 transition-colors">
            Sign In
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Signup;
