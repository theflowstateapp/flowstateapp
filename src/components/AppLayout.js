import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  User,
  Sun,
  Moon,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import { UserAnalytics } from '../lib/userAnalytics';
import { TourUtils } from '../utils/tourUtils';
import FlowStateLogo from './FlowStateLogo';
import Sidebar from './Sidebar';
import OnboardingTour from './OnboardingTour';
import NotificationSystem from './NotificationSystem';
import { QuickFeedback } from './FeedbackModal';
import ErrorBoundary from './ErrorBoundary';
import AIAssistant from '../pages/AIAssistant';
import Analytics from '../pages/Analytics';
import VoiceCapture from '../pages/VoiceCapture';
import Notes from '../pages/Notes';
import Calendar from '../pages/Calendar';
import AdvancedCalendar from '../pages/AdvancedCalendar';
// ... existing code ...
import MainDashboard from '../pages/MainDashboard';
import Dashboard from '../pages/Dashboard';
import TaskDetail from '../pages/TaskDetail';
import NewTaskForm from '../pages/NewTaskForm';
import NewProjectForm from '../pages/NewProjectForm';
import TaskAnalyticsDashboard from '../pages/TaskAnalyticsDashboard';
import ProjectAnalyticsDashboard from '../pages/ProjectAnalyticsDashboard';
import TemplateManagementDashboard from '../pages/TemplateManagementDashboard';
import SearchDashboard from '../pages/SearchDashboard';
import Inbox from '../pages/Inbox';
import InboxProcessing from '../pages/InboxProcessing';
import Tasks from '../pages/Tasks';
import Projects from '../pages/Projects';
import Areas from '../pages/Areas';
import Resources from '../pages/Resources';
import Archives from '../pages/Archives';
import Health from '../pages/Health';
import Learning from '../pages/Learning';
import Relationships from '../pages/Relationships';
import TimeManagement from '../pages/TimeManagement';
import Finance from '../pages/Finance';
import Knowledge from '../pages/Knowledge';
import Journal from '../pages/Journal';
import Habits from '../pages/Habits';
import Workouts from '../pages/Workouts';
import Meals from '../pages/Meals';
import Goals from '../pages/Goals';
import Review from '../pages/Review';
import System from '../pages/System';
import SettingsPage from '../pages/Settings';
import Help from '../pages/Help';
import IntegrationsPage from '../pages/IntegrationsPage';
import ProductAnalyticsDashboard from '../pages/ProductAnalyticsDashboard';
import QuickCapture from '../pages/QuickCapture';
import LifeTracker from '../pages/LifeTracker';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [onboardingStartTime, setOnboardingStartTime] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user needs onboarding
  useEffect(() => {
    const isNewUser = !localStorage.getItem('flowstate-tour-completed');
    
    if (isNewUser && user) {
      // Track tour start for analytics
      setOnboardingStartTime(Date.now());
      UserAnalytics.trackTourStart();
    }
  }, [user]);


  // Track page views
  useEffect(() => {
    const currentPath = window.location.pathname;
    UserAnalytics.trackPageView(currentPath);
    UserAnalytics.trackUserJourney('page_view', currentPath);
  }, [window.location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <DataProvider>
      <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
        {/* Onboarding Tour */}
        <OnboardingTour
          isFirstTime={user && !localStorage.getItem('flowstate-tour-completed')}
          onComplete={() => {
            localStorage.setItem('flowstate-tour-completed', 'true');
            if (onboardingStartTime) {
              const completionTime = Date.now() - onboardingStartTime;
              UserAnalytics.trackTourComplete(completionTime);
            }
          }}
        />

        {/* Quick Feedback */}
        <QuickFeedback />


      {/* Fixed Header - Responsive */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-gray-200/50 z-50 flex items-center justify-between px-4 lg:px-6 shadow-sm">
        <div className="flex items-center space-x-2 lg:space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <FlowStateLogo className="w-6 h-6 lg:w-8 lg:h-8" showText={true} />
        </div>

        <div className="flex items-center space-x-2 lg:space-x-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} className="lg:w-5 lg:h-5" /> : <Moon size={18} className="lg:w-5 lg:h-5" />}
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Search size={18} className="lg:w-5 lg:h-5" />
          </button>
          <NotificationSystem />
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User size={14} className="text-white lg:w-4 lg:h-4" />
              </div>
              <span className="hidden lg:block text-sm font-medium text-gray-700">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email?.split('@')[0] || 'User'}
              </span>
            </button>
            
            {/* User Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <button 
                  onClick={() => navigate('/settings')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Settings size={16} className="mr-3" />
                  Settings
                </button>
                <button 
                  onClick={() => navigate('/integrations')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Settings size={16} className="mr-3" />
                  Integrations
                </button>
                <button 
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <LogOut size={16} className="mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile Overlay / Desktop Fixed */}
      <div className={`
        fixed left-0 top-16 z-40 transition-all duration-300
        ${sidebarOpen ? 'w-64' : 'w-0'}
        lg:w-64 lg:relative lg:top-0 lg:h-screen lg:z-auto
        ${sidebarOpen ? 'block' : 'hidden lg:block'}
      `}>
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content area - Responsive */}
      <div className="flex-1 transition-all duration-300 min-h-screen w-full">
        <main className="h-[calc(100vh-4rem)] lg:h-screen overflow-y-auto bg-gray-50 pt-16 lg:pt-0 w-full" data-testid="main-content" data-tour="welcome">
          <ErrorBoundary>
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/main-dashboard" element={<MainDashboard />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/voice-capture" element={<VoiceCapture />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/calendar" element={<AdvancedCalendar />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/task/:taskId" element={<TaskDetail />} />
            <Route path="/new-task" element={<NewTaskForm />} />
            <Route path="/new-project" element={<NewProjectForm />} />
            <Route path="/task-analytics" element={<TaskAnalyticsDashboard />} />
            <Route path="/project-analytics" element={<ProjectAnalyticsDashboard />} />
            <Route path="/template-management" element={<TemplateManagementDashboard />} />
            <Route path="/search" element={<SearchDashboard />} />
            <Route path="/quick-capture" element={<QuickCapture />} />
            <Route path="/quick-capture/task" element={<QuickCapture />} />
            <Route path="/quick-capture/project" element={<QuickCapture />} />
            <Route path="/quick-capture/note" element={<QuickCapture />} />
            <Route path="/quick-capture/meeting" element={<QuickCapture />} />
            <Route path="/quick-capture/reference" element={<QuickCapture />} />
            <Route path="/quick-capture/contact" element={<QuickCapture />} />
            <Route path="/quick-capture/goal" element={<QuickCapture />} />
            <Route path="/template-guide" element={<QuickCapture />} />
            <Route path="/template-guide/para" element={<QuickCapture />} />
            <Route path="/template-guide/life-areas" element={<QuickCapture />} />
            <Route path="/template-guide/quick-capture" element={<QuickCapture />} />
            <Route path="/template-guide/review" element={<QuickCapture />} />
            <Route path="/plan" element={<QuickCapture />} />
            <Route path="/action" element={<QuickCapture />} />
            <Route path="/capture" element={<QuickCapture />} />
            <Route path="/track" element={<QuickCapture />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/inbox-processing" element={<InboxProcessing />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/areas" element={<Areas />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/health" element={<Health />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/relationships" element={<Relationships />} />
            <Route path="/time" element={<TimeManagement />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/life-tracker" element={<LifeTracker />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/review" element={<Review />} />
            <Route path="/system" element={<System />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/help" element={<Help />} />
            <Route path="/product-analytics" element={<ProductAnalyticsDashboard />} />
          </Routes>
        </ErrorBoundary>
        
        {/* Tour completion target */}
        <div data-tour="completion" className="hidden"></div>
        </main>
      </div>
    </div>
    </DataProvider>
  );
};

export default AppLayout;
