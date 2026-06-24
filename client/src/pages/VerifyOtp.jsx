import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader';

const VerifyOtp = () => {
  const { verifyOtpCode } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Extract email query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setError('No verification email provided. Please sign up first.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Missing email identifier. Please try signing up again.');
      return;
    }

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await verifyOtpCode(email, otp);
      
      setSuccessMsg(data.message || 'Verification successful! Logging you in...');
      setLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Verification failed. Please check the code and try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Background Dot Grid Overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none z-0"></div>

      {/* Background Aurora Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {loading && <Loader message="Verifying authentication code..." />}

      <div className="glass-panel saas-card-glow p-8 max-w-md w-full shadow-2xl border-zinc-800/80 bg-zinc-950/75 relative z-10">
        
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl w-fit mx-auto mb-4">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">Verify Account</h2>
          <p className="text-zinc-400 mt-2 text-xs leading-relaxed">
            We sent a verification code to: <br />
            <strong className="text-zinc-200 select-all font-mono text-xs">{email || 'your email'}</strong>
          </p>
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
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="flex flex-col">
            <label className="text-[11px] font-medium text-zinc-400 mb-2 ml-1 text-center">
              Enter 6-Digit Verification Code
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
              placeholder="123456"
              className="glass-input text-center tracking-[0.5em] text-2xl font-bold w-full bg-zinc-900/80 border-zinc-800 py-3"
              maxLength={6}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-6"
            disabled={!otp || otp.length !== 6}
          >
            Verify & Authenticate
          </button>

        </form>

        {/* Info label */}
        <p className="text-center text-[10px] text-zinc-500 mt-6 leading-relaxed">
          If you didn't receive the email, try registering again or check your spam filter.
        </p>

      </div>

    </div>
  );
};

export default VerifyOtp;
