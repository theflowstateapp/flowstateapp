import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const sidebarItems = [
    { label: 'Dashboard', href: '/app', icon: '🏠' },
    { label: 'Capture', href: '/app/capture', icon: '✍️' },
    { label: 'Tasks', href: '/app/tasks', icon: '✅' },
    { label: 'Focus', href: '/app/focus', icon: '🎯' },
    { label: 'Agenda', href: '/app/agenda', icon: '📅' },
    { label: 'Habits', href: '/app/habits', icon: '🔥' },
    { label: 'Journal', href: '/app/journal', icon: '📔' },
    { label: 'Review', href: '/app/review', icon: '📈' },
    { label: 'Settings', href: '/app/settings', icon: '⚙️' }
  ];
  
  const isActive = (href) => {
    // Check if current path starts with the href (prefix match)
    return location.pathname.startsWith(href);
  };
  
  const handleNavigation = (href) => {
    navigate(href);
  };
  
  return (
    <div className="h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">FlowState</h1>
        <p className="text-sm text-gray-500">Your Personal OS</p>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              isActive(item.href)
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Sidebar v2
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
