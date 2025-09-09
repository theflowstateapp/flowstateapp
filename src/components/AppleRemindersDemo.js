import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  CheckCircle,
  AlertCircle,
  Upload,
  RefreshCw,
  Target,
  Clock,
  Calendar,
  MapPin,
  Tag,
  ArrowRight,
  Play
} from 'lucide-react';
import AppleRemindersService from '../services/AppleRemindersService';

const AppleRemindersDemo = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoData, setDemoData] = useState(null);

  const handleConnect = async () => {
    setIsLoading(true);
    
    // Simulate connection process
    setTimeout(async () => {
      const result = await AppleRemindersService.requestPermission();
      setIsConnected(result.success);
      setIsLoading(false);
      
      if (result.success) {
        // Fetch demo data
        const listsResult = await AppleRemindersService.getReminderLists();
        if (listsResult.success) {
          setDemoData(listsResult);
        }
      }
    }, 2000);
  };

  const handleImport = async () => {
    setIsLoading(true);
    
    // Simulate import process
    setTimeout(async () => {
      const result = await AppleRemindersService.importReminders();
      setIsLoading(false);
      
      if (result.success) {
        // Show success message
        console.log(`Imported ${result.totalImported} reminders`);
      }
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-cyan-600 bg-clip-text text-transparent">
            Apple Reminders Integration
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Seamlessly import and sync your Apple Reminders with FlowState
        </p>
      </div>

      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-gray-400" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isConnected ? 'Connected to Apple Reminders' : 'Not Connected'}
              </h3>
              <p className="text-gray-600">
                {isConnected 
                  ? 'Ready to import and sync your reminders'
                  : 'Connect to start importing your Apple Reminders'
                }
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {isConnected ? (
              <>
                <button
                  onClick={handleImport}
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>Import Reminders</span>
                </button>
                <button
                  onClick={() => setIsConnected(false)}
                  className="btn-secondary"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="btn-primary flex items-center space-x-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>Connect</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Demo Data */}
      {demoData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Available Lists */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Available Lists</span>
            </h3>
            <div className="space-y-3">
              {demoData.lists.map((list, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{list.name}</span>
                    <span className="text-sm text-gray-500">({list.count} items)</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Import
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Reminders */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span>Sample Reminders</span>
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Buy groceries', list: 'Shopping', due: 'Tomorrow', priority: 'high' },
                { title: 'Call mom', list: 'Personal', due: 'In 2 hours', priority: 'medium' },
                { title: 'Finish project proposal', list: 'Work', due: 'In 3 days', priority: 'high' },
                { title: 'Doctor appointment', list: 'Health', due: 'Next week', priority: 'medium' },
                { title: 'Gym workout', list: 'Fitness', due: 'In 4 hours', priority: 'low' }
              ].map((reminder, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{reminder.title}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>{reminder.list}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{reminder.due}</span>
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reminder.priority === 'high' ? 'bg-red-100 text-red-700' :
                          reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {reminder.priority}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Import</h3>
          <p className="text-gray-600 text-sm">
            Automatically categorize and tag your reminders based on content and context
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bidirectional Sync</h3>
          <p className="text-gray-600 text-sm">
            Keep your reminders synchronized between Apple Reminders and FlowState
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Tagging</h3>
          <p className="text-gray-600 text-sm">
            Intelligent tag generation based on lists, content, and priority levels
          </p>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-center"
      >
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-6">
            Connect your Apple Reminders and start organizing your life with FlowState
          </p>
          <button
            onClick={() => window.location.href = '/settings?tab=integrations'}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Go to Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AppleRemindersDemo;



