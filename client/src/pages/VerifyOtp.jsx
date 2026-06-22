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
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {loading && <Loader message="Verifying authentication code..." />}

      <div className="glass-panel p-8 max-w-md w-full shadow-glow-primary border-brand-500/10 relative z-10">
        
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl w-fit mx-auto mb-4 border border-brand-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white">Verify Account</h2>
          <p className="text-gray-400 mt-2 text-sm">
            We sent a verification code to: <br />
            <strong className="text-gray-300 select-all">{email || 'your email'}</strong>
          </p>
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
            <label className="text-xs font-semibold text-gray-400 mb-1.5 ml-1 text-center">
              Enter 6-Digit Verification Code
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
              placeholder="123456"
              className="glass-input text-center tracking-[0.5em] text-2xl font-bold w-full"
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
        <p className="text-center text-xs text-gray-500 mt-6">
          If you didn't receive the email, try registering again or check your spam filter.
        </p>

      </div>

    </div>
  );
};

export default VerifyOtp;
