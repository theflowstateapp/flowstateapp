import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  type = 'text', 
  lines = 1, 
  width = '100%', 
  height = '1rem',
  className = '' 
}) => {
  const shimmerVariants = {
    initial: { opacity: 0.5 },
    animate: { 
      opacity: [0.5, 1, 0.5],
      transition: { 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  };

  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <motion.div
                key={index}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                className="bg-gray-200 rounded"
                style={{
                  width: index === lines - 1 ? '75%' : width,
                  height: height
                }}
              />
            ))}
          </div>
        );

      case 'card':
        return (
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`bg-gray-200 rounded-xl ${className}`}
            style={{ width, height }}
          >
            <div className="p-6 space-y-4">
              <div className="bg-gray-300 rounded h-6 w-3/4"></div>
              <div className="space-y-2">
                <div className="bg-gray-300 rounded h-4 w-full"></div>
                <div className="bg-gray-300 rounded h-4 w-5/6"></div>
                <div className="bg-gray-300 rounded h-4 w-4/6"></div>
              </div>
            </div>
          </motion.div>
        );

      case 'avatar':
        return (
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`bg-gray-200 rounded-full ${className}`}
            style={{ width, height }}
          />
        );

      case 'button':
        return (
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`bg-gray-200 rounded-lg ${className}`}
            style={{ width, height }}
          />
        );

      case 'table':
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <motion.div
                key={index}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                className="bg-gray-200 rounded h-12 w-full"
              />
            ))}
          </div>
        );

      default:
        return (
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className={`bg-gray-200 rounded ${className}`}
            style={{ width, height }}
          />
        );
    }
  };

  return renderSkeleton();
};

export default SkeletonLoader;
