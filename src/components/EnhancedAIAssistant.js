// Enhanced AI Assistant Component for LifeOS
// Comprehensive AI integration with OpenAI GPT-4, usage tracking, and intelligent features

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Lightbulb,
  TrendingUp,
  Target,
  Calendar,
  Heart,
  DollarSign,
  BookOpen,
  Users,
  Clock,
  FileText,
  Repeat,
  Zap,
  X,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Settings,
  Crown,
  Gift,
  Brain,
  MessageSquare,
  Smartphone,
  Monitor,
  Headphones,
  Camera,
  Video,
  Mic,
  Type,
  Edit3,
  BarChart3,
  PieChart,
  Activity,
  Target as TargetIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Heart as HeartIcon,
  DollarSign as DollarSignIcon,
  BookOpen as BookOpenIcon,
  Users as UsersIcon,
  FileText as FileTextIcon,
  Repeat as RepeatIcon
} from 'lucide-react';
import aiService, { AI_FEATURES } from '../lib/aiService';
import toast from 'react-hot-toast';

const AIAssistantComponent = ({ 
  featureType, 
  context = {}, 
  onResult = null,
  showSuggestions = true,
  placeholder = "Ask me anything...",
  maxSuggestions = 3,
  className = "",
  variant = "default", // default, compact, floating, insights
  showUsage = true,
  showConfidence = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [usage, setUsage] = useState(null);
  const [canUseAI, setCanUseAI] = useState(true);
  const [aiStatus, setAiStatus] = useState('available'); // available, loading, error, quota_exceeded
  const [lastResponse, setLastResponse] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    initializeAI();
    generateSuggestions();
  }, [featureType, context]);

  const initializeAI = async () => {
    try {
      await aiService.initialize();
      setAiStatus('available');
    } catch (error) {
      console.error('Error initializing AI:', error);
      setAiStatus('error');
    }
  };

  const generateSuggestions = () => {
    const featureSuggestions = {
      [AI_FEATURES.GOAL_ANALYSIS.name]: [
        "Analyze my current goals and suggest improvements",
        "Help me create SMART goals for this quarter",
        "What obstacles might I face with my current goals?",
        "How can I better track my goal progress?"
      ],
      [AI_FEATURES.PROJECT_ANALYSIS.name]: [
        "Analyze my project timeline and suggest optimizations",
        "Help me prioritize my project tasks",
        "What risks should I be aware of in this project?",
        "How can I improve my project management?"
      ],
      [AI_FEATURES.HABIT_ANALYSIS.name]: [
        "Analyze my habit consistency and suggest improvements",
        "Help me create a new habit routine",
        "What habits should I focus on next?",
        "How can I build better habits?"
      ],
      [AI_FEATURES.HEALTH_INSIGHTS.name]: [
        "Analyze my health data and provide insights",
        "Suggest a workout plan for my goals",
        "How can I improve my sleep quality?",
        "What nutrition changes should I consider?"
      ],
      [AI_FEATURES.FINANCIAL_ANALYSIS.name]: [
        "Analyze my spending patterns and suggest optimizations",
        "Help me create a budget plan",
        "What investment opportunities should I consider?",
        "How can I save more money?"
      ],
      [AI_FEATURES.LEARNING_PATH_OPTIMIZATION.name]: [
        "Analyze my learning progress and suggest next steps",
        "Recommend courses based on my goals",
        "How can I optimize my learning schedule?",
        "What skills should I focus on developing?"
      ],
      [AI_FEATURES.TIME_ANALYSIS.name]: [
        "Analyze my time usage and suggest optimizations",
        "Help me create a better schedule",
        "How can I improve my productivity?",
        "What time management techniques should I try?"
      ],
      [AI_FEATURES.MOOD_ANALYSIS.name]: [
        "Analyze my mood patterns and provide insights",
        "Suggest ways to improve my emotional well-being",
        "What triggers my stress and how can I manage it?",
        "How can I maintain better mental health?"
      ],
      [AI_FEATURES.NATURAL_LANGUAGE_TASK_CREATION.name]: [
        "Schedule a workout for tomorrow at 9 AM",
        "Create a task to call John about the project",
        "Remind me to pay the electricity bill next week",
        "Set up a meeting with the team on Friday"
      ]
    };

    const defaultSuggestions = [
      "How can I improve my productivity today?",
      "What should I focus on this week?",
      "Help me optimize my routine",
      "Give me personalized recommendations"
    ];

    const featureSpecificSuggestions = featureSuggestions[featureType] || defaultSuggestions;
    setSuggestions(featureSpecificSuggestions.slice(0, maxSuggestions));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !canUseAI) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setAiStatus('loading');

    // Add user message to conversation
    const newConversation = [...conversation, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString()
    }];
    setConversation(newConversation);

    try {
      // Make AI request
      const result = await aiService.makeAIRequest(featureType, userMessage, context);

      if (result.success) {
        const aiMessage = { 
          role: 'assistant', 
          content: result.result,
          source: result.source,
          confidence: result.confidence,
          timestamp: new Date().toISOString()
        };
        setConversation([...newConversation, aiMessage]);
        setLastResponse(result);

        // Call onResult callback if provided
        if (onResult) {
          onResult(result.result, result);
        }

        // Update AI status
        setAiStatus('available');
        
        // Show success toast
        toast.success('AI analysis complete!', {
          icon: '🤖',
          duration: 3000
        });
      } else {
        throw new Error('AI request failed');
      }
    } catch (error) {
      console.error('AI request error:', error);
      
      // Handle specific error types
      if (error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED')) {
        setAiStatus('quota_exceeded');
        toast.error('AI quota exceeded. Please try again later.', {
          icon: '⚠️',
          duration: 5000
        });
      } else if (error.message.includes('rate limit') || error.message.includes('RATE_LIMIT')) {
        setAiStatus('rate_limited');
        toast.error('Rate limit exceeded. Please wait a moment.', {
          icon: '⏱️',
          duration: 3000
        });
      } else {
        setAiStatus('error');
        toast.error('AI service temporarily unavailable. Please try again.', {
          icon: '❌',
          duration: 4000
        });
      }

      setConversation([...newConversation, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.',
        error: true,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const getFeatureIcon = () => {
    const icons = {
      [AI_FEATURES.GOAL_ANALYSIS.name]: TargetIcon,
      [AI_FEATURES.PROJECT_ANALYSIS.name]: CalendarIcon,
      [AI_FEATURES.HABIT_ANALYSIS.name]: RepeatIcon,
      [AI_FEATURES.HEALTH_INSIGHTS.name]: HeartIcon,
      [AI_FEATURES.FINANCIAL_ANALYSIS.name]: DollarSignIcon,
      [AI_FEATURES.LEARNING_PATH_OPTIMIZATION.name]: BookOpenIcon,
      [AI_FEATURES.TIME_ANALYSIS.name]: ClockIcon,
      [AI_FEATURES.MOOD_ANALYSIS.name]: FileTextIcon,
      [AI_FEATURES.NATURAL_LANGUAGE_TASK_CREATION.name]: MessageSquare
    };
    return icons[featureType] || Bot;
  };

  const getStatusColor = () => {
    switch (aiStatus) {
      case 'available': return 'text-green-500';
      case 'loading': return 'text-blue-500';
      case 'error': return 'text-red-500';
      case 'quota_exceeded': return 'text-orange-500';
      case 'rate_limited': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (aiStatus) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'loading': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'quota_exceeded': return <AlertCircle className="w-4 h-4" />;
      case 'rate_limited': return <Clock className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const renderConversation = () => {
    return conversation.map((message, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
          <div className={`rounded-lg px-4 py-2 ${
            message.role === 'user' 
              ? 'bg-blue-500 text-white' 
              : message.error 
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-gray-100 text-gray-800'
          }`}>
            <div className="text-sm">{message.content}</div>
            {message.source && (
              <div className="text-xs opacity-70 mt-1">
                Powered by {message.source === 'openai' ? 'GPT-4' : 'AI Assistant'}
              </div>
            )}
            {message.confidence && showConfidence && (
              <div className="text-xs opacity-70 mt-1">
                Confidence: {Math.round(message.confidence * 100)}%
              </div>
            )}
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          message.role === 'user' ? 'order-1 ml-2' : 'order-2 mr-2'
        }`}>
          {message.role === 'user' ? (
            <User className="w-5 h-5 text-blue-500" />
          ) : (
            <Bot className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </motion.div>
    ));
  };

  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Try asking:</div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  const renderCompactVariant = () => (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Bot className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-semibold text-gray-800">AI Assistant</span>
              </div>
              <div className={`flex items-center ${getStatusColor()}`}>
                {getStatusIcon()}
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto mb-4">
              {renderConversation()}
            </div>

            {renderSuggestions()}

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || !canUseAI}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || !canUseAI}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderInsightsVariant = () => (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Brain className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h3 className="font-semibold text-gray-800">AI Insights</h3>
            <p className="text-sm text-gray-600">Get intelligent recommendations</p>
          </div>
        </div>
        <div className={`flex items-center ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
      </div>

      {lastResponse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-4 mb-4 border border-gray-200"
        >
          <div className="text-sm text-gray-800">{lastResponse.result}</div>
          {showConfidence && lastResponse.confidence && (
            <div className="text-xs text-gray-500 mt-2">
              Confidence: {Math.round(lastResponse.confidence * 100)}%
            </div>
          )}
        </motion.div>
      )}

      {renderSuggestions()}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || !canUseAI}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || !canUseAI}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );

  const renderDefaultVariant = () => (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {React.createElement(getFeatureIcon(), { className: "w-6 h-6 text-blue-500 mr-3" })}
          <div>
            <h3 className="font-semibold text-gray-800">AI Assistant</h3>
            <p className="text-sm text-gray-600">Powered by GPT-4</p>
          </div>
        </div>
        <div className={`flex items-center ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto mb-4">
        {renderConversation()}
      </div>

      {renderSuggestions()}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || !canUseAI}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || !canUseAI}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'compact':
      return renderCompactVariant();
    case 'insights':
      return renderInsightsVariant();
    case 'floating':
      return renderCompactVariant(); // Same as compact for now
    default:
      return renderDefaultVariant();
  }
};

export default AIAssistantComponent;
