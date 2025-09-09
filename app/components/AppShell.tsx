import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppShell = ({ children }) => {
  const location = useLocation();
  
  // Check for legacy UI flag
  const isLegacyMode = new URLSearchParams(location.search).get('ui') === 'legacy';
  
  if (isLegacyMode) {
    // Render minimal legacy shell
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          {children}
        </div>
      </div>
    );
  }
  
  // Render new shell with Sidebar v2 and Topbar
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="w-60 flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
