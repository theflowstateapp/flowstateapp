import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, AlertCircle } from 'lucide-react';

const DemoBanner = ({ isDemo, onDismiss }) => {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleCreateAccount = () => {
    // Redirect to signup page
    window.location.href = '/signup';
  };

  if (!isDemo || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  You're in a demo workspace. Data resets periodically.
                </p>
                <p className="text-xs text-blue-100 mt-1">
                  Create an account to keep your setup and access all features.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreateAccount}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Create Account</span>
              </button>
              
              <button
                onClick={handleDismiss}
                className="text-white hover:text-blue-200 transition-colors p-1"
                aria-label="Dismiss banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoBanner;
