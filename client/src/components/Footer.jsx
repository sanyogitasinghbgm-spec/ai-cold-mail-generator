import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-cosmic-bg/40 py-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="text-sm font-semibold text-gray-500">
            &copy; {new Date().getFullYear()} ColdMail.ai. All rights reserved.
          </span>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand-400 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
