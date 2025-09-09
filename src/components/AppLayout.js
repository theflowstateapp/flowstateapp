import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import { UserAnalytics } from '../lib/userAnalytics';
import { TourUtils } from '../utils/tourUtils';
import AppShell from './AppShell';
import Redirect from './Redirect';
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
import FocusPage from '../pages/FocusPage';
import NextActionsPage from '../pages/NextActionsPage';
import FocusModePage from '../pages/FocusModePage';
import DailyShutdown from '../pages/DailyShutdown';
import DemoBanner from './DemoBanner';
import HomePage from '../pages/HomePage';
import DashboardNew from '../pages/DashboardNew';
import WeekAgendaPage from '../pages/WeekAgendaPage';
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
import LifeTracker from '../pages/LifeTracker';
import ProductAnalyticsDashboard from '../pages/ProductAnalyticsDashboard';
import QuickCapture from '../pages/QuickCapture';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [onboardingStartTime, setOnboardingStartTime] = useState(null);

  // Check for legacy UI flag
  const isLegacyUI = new URLSearchParams(location.search).get('ui') === 'legacy';

  // Initialize onboarding start time
  useEffect(() => {
    if (user && !localStorage.getItem('flowstate-tour-completed')) {
      setOnboardingStartTime(Date.now());
    }
  }, [user]);

  // Initialize analytics and tour
  useEffect(() => {
    if (user) {
      UserAnalytics.initialize(user);
      TourUtils.initialize();
    }
  }, [user]);

  // Check if this is a demo
  const isDemo = location.pathname.startsWith('/demo');

  if (isLegacyUI) {
    // Render a minimal "legacy" shell for temporary rollback
    return (
      <DataProvider>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">FlowState (Legacy UI)</h1>
            <span className="text-sm text-gray-500">Rollback Mode</span>
          </header>
          <main className="p-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/app" element={<DashboardNew />} />
              <Route path="/demo" element={<DashboardNew />} />
              <Route path="/demo/*" element={<DashboardNew />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/shutdown" element={<DailyShutdown />} />
              <Route path="/*" element={<DashboardNew />} />
            </Routes>
          </main>
        </div>
      </DataProvider>
    );
  }

  // Render the new AppShell for all /app routes
  return (
    <DataProvider>
      <AppShell>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/app" element={<DashboardNew />} />
            {/* Redirects */}
            <Route path="/app/calendar" element={<Redirect to="/app/agenda" />} />
            <Route path="/calendar" element={<Redirect to="/app/agenda" />} />
            {/* New Sidebar v2 routes */}
            <Route path="/app/capture" element={<QuickCapture />} />
            <Route path="/capture" element={<QuickCapture />} />
            <Route path="/app/tasks" element={<Tasks />} />
            <Route path="/app/focus" element={<FocusPage />} />
            <Route path="/app/agenda" element={<WeekAgendaPage />} />
            <Route path="/app/habits" element={<Habits />} />
            <Route path="/app/journal" element={<Journal />} />
            <Route path="/app/review" element={<Review />} />
            <Route path="/app/settings" element={<SettingsPage />} />

            {/* Existing routes that might still be used directly or for demo */}
            <Route path="/main-dashboard" element={<MainDashboard />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/voice-capture" element={<VoiceCapture />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/focus" element={<FocusPage />} /> {/* Keep for direct access */}
            <Route path="/tasks" element={<Tasks />} /> {/* Keep for direct access */}
            <Route path="/agenda" element={<WeekAgendaPage />} /> {/* Keep for direct access */}
            <Route path="/habits" element={<Habits />} /> {/* Keep for direct access */}
            <Route path="/journal" element={<Journal />} /> {/* Keep for direct access */}
            <Route path="/review" element={<Review />} /> {/* Keep for direct access */}
            <Route path="/settings" element={<SettingsPage />} /> {/* Keep for direct access */}

            {/* Other existing routes */}
            <Route path="/next-actions" element={<NextActionsPage />} />
            <Route path="/focus-mode" element={<FocusModePage />} />
            <Route path="/shutdown" element={<DailyShutdown />} />
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
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/inbox-processing" element={<InboxProcessing />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/areas" element={<Areas />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/life-tracker" element={<LifeTracker />} />
            <Route path="/health" element={<Health />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/relationships" element={<Relationships />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/help" element={<Help />} />
            <Route path="/product-analytics" element={<ProductAnalyticsDashboard />} />
          </Routes>
        </ErrorBoundary>
        {/* Tour completion target */}
        <div data-tour="completion" className="hidden"></div>
      </AppShell>
    </DataProvider>
  );
};

export default AppLayout;