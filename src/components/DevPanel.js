import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Play, 
  RotateCcw, 
  Eye, 
  X,
  Sparkles,
  CheckCircle,
  Clock
} from 'lucide-react';
import { TourUtils } from '../utils/tourUtils';

const DevPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tourStatus, setTourStatus] = useState(TourUtils.isTourCompleted());

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleResetTour = () => {
    TourUtils.resetTour();
    setTourStatus(false);
    console.log('Tour reset - refresh page to see tour');
  };

  const handleStartTour = () => {
    TourUtils.startTour();
  };

  const handleRefreshStatus = () => {
    setTourStatus(TourUtils.isTourCompleted());
  };

  return (
    <>
      {/* Floating Dev Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="Development Tools"
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Dev Panel Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Dev Tools</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tour Status */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Onboarding Tour</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {tourStatus ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="text-sm text-gray-600">
                        {tourStatus ? 'Completed' : 'Not Completed'}
                      </span>
                    </div>
                    <button
                      onClick={handleRefreshStatus}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {/* Tour Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleResetTour}
                  className="w-full flex items-center justify-center space-x-2 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Tour</span>
                </button>
                
                <button
                  onClick={handleStartTour}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Tour Now</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Instructions:</strong><br />
                  • Reset Tour: Clears completion status<br />
                  • Start Tour: Resets and refreshes page<br />
                  • Tour will show on next login if not completed
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DevPanel;
