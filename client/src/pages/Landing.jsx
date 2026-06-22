import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Mail, Send, Zap, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden">
      
      {/* Background Neon Glow Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 sm:mb-8 animate-float">
            <Sparkles className="h-4 w-4 text-brand-400" />
            <span className="text-xs font-semibold text-gray-300">Powered by Gemini-1.5-Flash</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white mb-6 leading-none">
            Write Cold Outreach That <span className="text-gradient">Gets Replies</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Generate full outreach campaigns in seconds. Get matching cold emails, follow-up sequences, and low-friction LinkedIn DMs from a single natural-language description.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary w-full sm:w-auto">
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary w-full sm:w-auto text-base">
                  Generate Campaign Free
                  <Sparkles className="h-5 w-5" />
                </Link>
                <Link to="/login" className="btn-secondary w-full sm:w-auto text-base">
                  Sign In
                </Link>
              </>
            )}
          </div>
          
        </div>

        {/* Feature Cards Section */}
        <div className="mt-24 sm:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-8 relative overflow-hidden group hover:border-brand-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
            <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl w-fit mb-6">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Structured Campaigns</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every generation compiles a cohesive subject line, primary email body, social DM, and a secondary follow-up, giving you a ready-to-run sequence.
            </p>
          </div>

          <div className="glass-panel p-8 relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl w-fit mb-6">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Intelligent Contexts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fine-tune copy by specifying target audience segments and desired tones. Convert raw job descriptions into hyper-targeted value propositions.
            </p>
          </div>

          <div className="glass-panel p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-6">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Generation History</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Never lose high-performing templates. All created campaigns are saved securely to your private database history so you can retrieve them anytime.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
};

export default Landing;
