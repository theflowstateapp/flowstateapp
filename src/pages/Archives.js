import React from 'react';
import { motion } from 'framer-motion';
import { Archive } from 'lucide-react';

const Archives = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Archive className="mr-3 text-gray-500" size={32} />
              Archives
            </h1>
            <p className="text-gray-600 mt-1">Completed and archived items</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Archives</h2>
          <p className="text-gray-600">Archives page coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Archives;
