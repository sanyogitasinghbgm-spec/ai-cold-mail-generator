import React from 'react';

const Loader = ({ message = 'Generating magic...' }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50 transition-all duration-300">
      <div className="glass-panel p-8 max-w-sm w-full flex flex-col items-center text-center shadow-glow-primary border-brand-500/20">
        <div className="relative w-16 h-16 mb-4">
          {/* Glowing background circles */}
          <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl animate-pulse"></div>
          {/* Animated Spinner Ring */}
          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-brand-500 border-r-pink-500 rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2 font-display">Please Wait</h3>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
