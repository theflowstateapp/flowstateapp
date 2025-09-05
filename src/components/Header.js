import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Crown,
  HelpCircle,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'Weekly Review Due',
      message: 'Your weekly review is scheduled for tomorrow',
      time: '2 hours ago',
      type: 'reminder'
    },
    {
      id: 2,
      title: 'New Feature Available',
      message: 'AI-powered insights are now available',
      time: '1 day ago',
      type: 'feature'
    }
  ];

  const userMenuItems = [
    {
      name: 'Profile',
      icon: User,
      action: () => navigate('/settings')
    },
    {
      name: 'Settings',
      icon: Settings,
      action: () => navigate('/settings')
    },
    {
      name: 'Help & Support',
      icon: HelpCircle,
      action: () => navigate('/help')
    },
    {
      name: 'Sign Out',
      icon: LogOut,
      action: handleSignOut,
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Left side - Search */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center space-x-4">
        {/* Premium Features Badge */}
        <div className="relative">
          <button className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
            <Crown size={16} />
            <span className="text-sm font-medium">Premium</span>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">Day 11</span>
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="AI Assistant">
            <Sparkles size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200" title="Help">
            <HelpCircle size={20} />
          </button>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                {user?.email || 'User'}
              </p>
              <p className="text-xs text-gray-500">Free Trial</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {/* User Menu Dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                {/* User Info */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.email || 'User'}</p>
                      <p className="text-xs text-gray-500">Free Trial • Day 11 of 30</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {userMenuItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        item.action();
                        setShowUserMenu(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 ${item.className || ''}`}
                    >
                      <item.icon size={16} className="mr-3" />
                      {item.name}
                    </button>
                  ))}
                </div>

                {/* Upgrade Section */}
                <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Upgrade to Premium</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">Unlock AI insights, advanced analytics, and more</p>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm py-2 px-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                    Upgrade Now
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
