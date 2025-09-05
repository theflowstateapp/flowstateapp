import React from 'react';
import { motion } from 'framer-motion';

const FlowStateLogo = ({ className = "w-8 h-8", showText = true, animated = true }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Enhanced Wave Logo SVG with Animation */}
      <motion.svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Wave 1 - Main Flow */}
        <motion.path
          d="M1 16C3 12 7 8 11 12C15 16 19 20 23 16C25 14 27 12 29 10"
          stroke="url(#waveGradient1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Animated Wave 2 - Secondary Flow */}
        <motion.path
          d="M1 20C3 16 7 12 11 16C15 20 19 24 23 20C25 18 27 16 29 14"
          stroke="url(#waveGradient2)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
        />
        
        {/* Animated Wave 3 - Tertiary Flow */}
        <motion.path
          d="M1 24C3 20 7 16 11 20C15 24 19 28 23 24C25 22 27 20 29 18"
          stroke="url(#waveGradient3)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
        />
        
        {/* Flowing Water Droplets */}
        {animated && (
          <>
            <motion.circle
              cx="8"
              cy="14"
              r="1"
              fill="url(#dropletGradient)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, 4, 8]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle
              cx="16"
              cy="18"
              r="0.8"
              fill="url(#dropletGradient)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, 3, 6]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.circle
              cx="24"
              cy="22"
              r="0.6"
              fill="url(#dropletGradient)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, 2, 4]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </>
        )}
        
        {/* Enhanced Gradient Definitions */}
        <defs>
          {/* Main Wave Gradients */}
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="30%" stopColor="#8B5CF6" />
            <stop offset="70%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="40%" stopColor="#06B6D4" />
            <stop offset="80%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          
          {/* Droplet Gradient */}
          <radialGradient id="dropletGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </radialGradient>
          
          {/* Animated Wave Effect */}
          <filter id="waveGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </motion.svg>
      
      {/* Enhanced Logo Text with Animation */}
      {showText && (
        <motion.div 
          className="flex flex-col"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.span 
            className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
            animate={animated ? {
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            } : {}}
            transition={animated ? {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
            style={animated ? {
              backgroundSize: "200% 200%"
            } : {}}
          >
            FlowState
          </motion.span>
          <motion.span 
            className="text-xs text-gray-500 -mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Life OS
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};

export default FlowStateLogo;