import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader';

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await loginUser(email, password);
      
      setSuccessMsg(data.message || 'Logged in successfully!');
      setLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errMsg);

      // If the backend indicates that the email address is unverified
      if (err.response?.status === 403 || errMsg.toLowerCase().includes('verify')) {
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {loading && <Loader message="Verifying credentials..." />}

      <div className="glass-panel p-8 max-w-md w-full shadow-glow-primary border-brand-500/10 relative z-10">
        
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl w-fit mx-auto mb-4 border border-brand-500/20">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white">Welcome Back</h2>
          <p className="text-gray-400 mt-2 text-sm">Sign in to your outreach account</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 text-sm">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-400 mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="glass-input pl-10 w-full"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-400 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="glass-input pl-10 w-full"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-6">
            Sign In
          </button>

        </form>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;
