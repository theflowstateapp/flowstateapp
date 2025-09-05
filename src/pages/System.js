import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader,
  CheckCircle,
  Circle,
  Star,
  BarChart3,
  TrendingUp,
  Activity,
  Database,
  Shield,
  Zap,
  Clock,
  Calendar,
  Bell,
  Palette,
  Globe,
  User,
  Key,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const System = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupType, setBackupType] = useState('export');
  const { user } = useAuth();

  const tabs = [
    { value: 'overview', label: 'Overview', icon: BarChart3 },
    { value: 'backup', label: 'Backup & Sync', icon: Database },
    { value: 'security', label: 'Security', icon: Shield },
    { value: 'performance', label: 'Performance', icon: Zap },
    { value: 'notifications', label: 'Notifications', icon: Bell },
    { value: 'appearance', label: 'Appearance', icon: Palette }
  ];

  // Sample system data (in real app, this would come from database)
  const systemStats = {
    dataUsage: {
      total: '2.4 GB',
      used: '1.8 GB',
      available: '600 MB'
    },
    performance: {
      uptime: '99.9%',
      responseTime: '120ms',
      lastBackup: '2 hours ago'
    },
    security: {
      lastLogin: '2 hours ago',
      failedAttempts: 0,
      twoFactorEnabled: true
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-blue-600">Data Usage</p>
              <p className="text-2xl font-bold text-blue-700">{systemStats.dataUsage.used}</p>
            </div>
            <Database className="text-blue-500" size={24} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total</span>
              <span className="font-medium">{systemStats.dataUsage.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available</span>
              <span className="font-medium">{systemStats.dataUsage.available}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-green-600">Performance</p>
              <p className="text-2xl font-bold text-green-700">{systemStats.performance.uptime}</p>
            </div>
            <Zap className="text-green-500" size={24} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Response Time</span>
              <span className="font-medium">{systemStats.performance.responseTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Backup</span>
              <span className="font-medium">{systemStats.performance.lastBackup}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-purple-600">Security</p>
              <p className="text-2xl font-bold text-purple-700">Active</p>
            </div>
            <Shield className="text-purple-500" size={24} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Login</span>
              <span className="font-medium">{systemStats.security.lastLogin}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">2FA</span>
              <span className="font-medium text-green-600">Enabled</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => setSelectedTab('backup')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <Download className="mx-auto mb-2 text-gray-400" size={24} />
              <span className="text-sm font-medium text-gray-600">Backup Data</span>
            </button>
            <button 
              onClick={() => setSelectedTab('security')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
            >
              <Shield className="mx-auto mb-2 text-gray-400" size={24} />
              <span className="text-sm font-medium text-gray-600">Security Settings</span>
            </button>
            <button 
              onClick={() => setSelectedTab('performance')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
            >
              <Zap className="mx-auto mb-2 text-gray-400" size={24} />
              <span className="text-sm font-medium text-gray-600">Performance</span>
            </button>
            <button 
              onClick={() => setSelectedTab('notifications')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
            >
              <Bell className="mx-auto mb-2 text-gray-400" size={24} />
              <span className="text-sm font-medium text-gray-600">Notifications</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackup = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Backup & Sync</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Export Data</h4>
              <p className="text-gray-600 mb-4">Download all your data as a backup file.</p>
              <button
                onClick={() => {
                  setBackupType('export');
                  setShowBackupModal(true);
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Download size={20} />
                <span>Export Data</span>
              </button>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Import Data</h4>
              <p className="text-gray-600 mb-4">Restore your data from a backup file.</p>
              <button
                onClick={() => {
                  setBackupType('import');
                  setShowBackupModal(true);
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Upload size={20} />
                <span>Import Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Backup History</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900">Full Backup</h5>
                <p className="text-sm text-gray-600">2 hours ago • 1.8 GB</p>
              </div>
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900">Incremental Backup</h5>
                <p className="text-sm text-gray-600">1 day ago • 45 MB</p>
              </div>
              <CheckCircle className="text-green-500" size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-600">Enabled</span>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Configure
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Password</h4>
              <p className="text-sm text-gray-600">Last changed 30 days ago</p>
            </div>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Login History</h4>
              <p className="text-sm text-gray-600">View recent login attempts</p>
            </div>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{systemStats.performance.uptime}</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{systemStats.performance.responseTime}</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">2.4 GB</div>
              <div className="text-sm text-gray-600">Data Usage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">
              Enabled
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications in your browser</p>
            </div>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Configure
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Weekly Reports</h4>
              <p className="text-sm text-gray-600">Get weekly summaries of your activity</p>
            </div>
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Theme</h4>
            <div className="grid grid-cols-3 gap-4">
              <button className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg text-center">
                <div className="w-8 h-8 bg-blue-500 rounded mx-auto mb-2"></div>
                <span className="text-sm font-medium text-blue-700">Light</span>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-gray-300">
                <div className="w-8 h-8 bg-gray-800 rounded mx-auto mb-2"></div>
                <span className="text-sm font-medium text-gray-700">Dark</span>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-gray-300">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded mx-auto mb-2"></div>
                <span className="text-sm font-medium text-gray-700">Auto</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Accent Color</h4>
            <div className="grid grid-cols-6 gap-3">
              {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                <button
                  key={color}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-gray-400"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'backup':
        return renderBackup();
      case 'security':
        return renderSecurity();
      case 'performance':
        return renderPerformance();
      case 'notifications':
        return renderNotifications();
      case 'appearance':
        return renderAppearance();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 text-gray-500" size={32} />
            System Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your Life OS configuration</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedTab(tab.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedTab === tab.value
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <TabIcon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Backup Modal */}
      {showBackupModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowBackupModal(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {backupType === 'export' ? 'Export Data' : 'Import Data'}
              </h3>
              <button
                onClick={() => setShowBackupModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                {backupType === 'export' 
                  ? 'This will download all your data as a JSON file for backup purposes.'
                  : 'This will restore your data from a previously exported backup file.'
                }
              </p>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowBackupModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success(backupType === 'export' ? 'Data exported successfully!' : 'Data imported successfully!');
                    setShowBackupModal(false);
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
                  {backupType === 'export' ? <Download size={16} /> : <Upload size={16} />}
                  <span>{backupType === 'export' ? 'Export' : 'Import'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default System;

