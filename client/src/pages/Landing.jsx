import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Mail, Send, Zap, MessageSquare, ArrowRight } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden">
      
      {/* Background Dot Grid Overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none z-0"></div>
      
      {/* Background Aurora Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-brand-500/10 to-transparent rounded-full blur-[100px] pointer-events-none z-0"></div>

      <main className="relative flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 z-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 mb-6 sm:mb-8 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[11px] font-medium text-zinc-300">Powered by Groq & Llama-3.3</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white mb-6 leading-none bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Write Cold Outreach That <span className="text-zinc-100 underline decoration-zinc-700 decoration-wavy underline-offset-8">Gets Replies</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed font-normal">
            Generate complete multi-channel outreach campaigns in seconds. Get customized cold emails, follow-up emails, and professional LinkedIn connection DMs from a single prompt.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary w-full sm:w-auto">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary w-full sm:w-auto">
                  Generate Campaign Free
                  <Sparkles className="h-4 w-4" />
                </Link>
                <Link to="/login" className="btn-secondary w-full sm:w-auto">
                  Sign In
                </Link>
              </>
            )}
          </div>
          
        </div>

        {/* Feature Cards Section */}
        <div className="mt-28 sm:mt-36 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Card 1 */}
          <div className="glass-panel saas-card-glow p-8 relative overflow-hidden group hover:border-zinc-700 hover:bg-zinc-900/30 transition-all duration-300">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg w-fit mb-5">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2.5">Structured Campaigns</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every generation compiles a cohesive subject line, primary email body, social DM, and a secondary follow-up, giving you a ready-to-run sequence.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel saas-card-glow p-8 relative overflow-hidden group hover:border-zinc-700 hover:bg-zinc-900/30 transition-all duration-300">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg w-fit mb-5">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2.5">Intelligent Contexts</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Fine-tune copy by specifying target audience segments and desired tones. Convert raw job descriptions into hyper-targeted value propositions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel saas-card-glow p-8 relative overflow-hidden group hover:border-zinc-700 hover:bg-zinc-900/30 transition-all duration-300">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg w-fit mb-5">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2.5">Generation History</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Never lose high-performing templates. All created campaigns are saved securely to your private database history so you can retrieve them anytime.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
};

export default Landing;
