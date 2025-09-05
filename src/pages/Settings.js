import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Bell,
  Eye,
  Shield,
  Palette,
  User,
  Mail,
  Download,
  Trash2,
  Save,
  Check,
  Moon,
  Sun,
  Globe,
  Zap,
  ArrowRight,
  ChevronRight,
  CreditCard,
  Bot,
  TrendingUp,
  Smartphone,
  Calendar,
  Clock,
  Target,
  Heart,
  DollarSign,
  GraduationCap,
  Users,
  Lightbulb,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Filter,
  Search,
  Upload,
  Sync,
  Wifi,
  WifiOff,
  FileText,
  MessageSquare,
  Key,
  Lock,
  Camera,
  Edit3,
  Database,
  HardDrive,
  Cloud,
  Activity,
  BarChart3,
  PieChart,
  Settings2,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  MousePointer,
  Brain,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import UsageDashboard from '../components/UsageDashboard';
import AppleRemindersService from '../services/AppleRemindersService';
import GmailService from '../services/GmailService';
import { useData } from '../contexts/DataContext';

// ToggleSetting Component
const ToggleSetting = ({ title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const Settings = () => {
  const { user, signOut } = useAuth();
  const { createTask } = useData();
  
  const [settings, setSettings] = useState({
    profile: {
      name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User',
      email: user?.email || 'user@flowstate.com',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      timezone: 'UTC-5',
      language: user?.preferences?.language || 'English',
      bio: '',
      website: '',
      location: ''
    },
    integrations: {
      appleReminders: {
        enabled: false,
        autoSync: false,
        syncFrequency: 'daily',
        importCompleted: false,
        importLists: [],
        lastSync: null
      },
      googleCalendar: {
        enabled: false,
        autoSync: false,
        syncFrequency: 'hourly'
      },
      notion: {
        enabled: false,
        autoSync: false
      },
      todoist: {
        enabled: false,
        autoSync: false
      }
    },
    notifications: {
      email: user?.preferences?.emailUpdates || true,
      push: true,
      sms: false,
      dailyDigest: true,
      weeklyReport: true,
      goalReminders: true,
      habitReminders: true,
      projectUpdates: true,
      healthReminders: true,
      financeAlerts: true,
      taskDeadlines: true,
      teamUpdates: false,
      systemAlerts: true,
      marketingEmails: false
    },
    appearance: {
      theme: user?.preferences?.theme || 'light',
      fontSize: 'medium',
      compactMode: false,
      showAnimations: true,
      colorScheme: 'blue',
      sidebarCollapsed: false,
      density: 'comfortable',
      accentColor: 'blue'
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
      analytics: true,
      locationServices: false,
      thirdPartyCookies: false
    },
    data: {
      autoBackup: true,
      backupFrequency: 'daily',
      exportFormat: 'json',
      dataRetention: '2 years'
    },
    productivity: {
      focusMode: false,
      pomodoroTimer: true,
      breakReminders: true,
      workHours: { start: '09:00', end: '17:00' },
      weekendMode: false,
      autoArchive: true,
      smartSuggestions: true,
      timeTracking: true,
      distractionBlocking: false
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      fontSize: 'medium',
      colorBlindSupport: false,
      voiceOver: false
    },
    advanced: {
      debugMode: false,
      betaFeatures: false,
      experimentalAI: false,
      performanceMode: 'balanced',
      cacheSize: 'medium',
      syncFrequency: 'real-time',
      offlineMode: false
    },
    ai: {
      personality: 'professional',
      responseLength: 'detailed',
      smartSuggestions: true,
      autoCategorization: true,
      contextAwareness: true,
      proactiveAssistance: true,
      learnFromUsage: true,
      personalizedRecommendations: true,
      dataAnonymization: true,
      modelPreference: 'balanced',
      voiceCommands: false,
      smartScheduling: true,
      priorityDetection: true,
      deadlinePrediction: true,
      habitAnalysis: true
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Apple Reminders integration state
  const [appleRemindersStatus, setAppleRemindersStatus] = useState({
    connected: false,
    loading: false,
    error: null,
    reminderLists: [],
    importProgress: 0
  });

  // Gmail integration state
  const [gmailStatus, setGmailStatus] = useState({
    connected: false,
    loading: false,
    error: null,
    labels: [],
    importProgress: 0
  });

  const handleToggleSetting = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleUpdateSetting = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      // Show loading state
      toast.loading('Saving settings...', { id: 'save-settings' });
      
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would save to backend here
      // await apiService.updateUserSettings(settings);
      
      // Update user preferences in context
      if (user) {
        // Update user object with new preferences
        const updatedUser = {
          ...user,
          preferences: {
            ...user.preferences,
            theme: settings.appearance.theme,
            language: settings.profile.language,
            emailUpdates: settings.notifications.email,
            notifications: settings.notifications.email
          }
        };
        // In a real app, you would update the user context here
        // setUser(updatedUser);
      }
      
      setShowSaveSuccess(true);
      toast.success('Settings saved successfully!', { id: 'save-settings' });
      setTimeout(() => setShowSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      // Reset to default settings
      setSettings({
        profile: {
          name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User',
          email: user?.email || 'user@flowstate.com',
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          timezone: 'UTC-5',
          language: user?.preferences?.language || 'English',
          bio: '',
          website: '',
          location: ''
        },
        integrations: {
          appleReminders: { connected: false, lastSync: null },
          gmail: { connected: false, lastSync: null },
          googleCalendar: { connected: false, lastSync: null },
          notion: { connected: false, lastSync: null },
          todoist: { connected: false, lastSync: null }
        },
        notifications: {
          email: user?.preferences?.emailUpdates || true,
          push: true,
          sms: false,
          dailyDigest: true,
          weeklyReport: true,
          goalReminders: true,
          habitReminders: true,
          projectUpdates: true,
          healthReminders: true,
          financeAlerts: true,
          taskDeadlines: true,
          teamUpdates: false,
          systemAlerts: true,
          marketingEmails: false
        },
        appearance: {
          theme: user?.preferences?.theme || 'light',
          fontSize: 'medium',
          compactMode: false,
          showAnimations: true,
          colorScheme: 'blue',
          sidebarCollapsed: false,
          density: 'comfortable',
          accentColor: 'blue'
        },
        privacy: {
          profileVisibility: 'private',
          dataSharing: false,
          analytics: true,
          locationServices: false,
          thirdPartyCookies: false
        },
        data: {
          autoBackup: true,
          backupFrequency: 'daily',
          exportFormat: 'json',
          dataRetention: '2 years'
        },
        productivity: {
          focusMode: false,
          pomodoroTimer: true,
          breakReminders: true,
          workHours: { start: '09:00', end: '17:00' },
          weekendMode: false,
          autoArchive: true,
          smartSuggestions: true,
          timeTracking: true,
          distractionBlocking: false
        },
        accessibility: {
          highContrast: false,
          reducedMotion: false,
          screenReader: false,
          keyboardNavigation: true,
          fontSize: 'medium',
          colorBlindSupport: false,
          voiceOver: false
        },
        advanced: {
          debugMode: false,
          betaFeatures: false,
          experimentalAI: false,
          performanceMode: 'balanced',
          cacheSize: 'medium',
          syncFrequency: 'real-time',
          offlineMode: false
        },
        ai: {
          personality: 'professional',
          responseLength: 'detailed',
          smartSuggestions: true,
          autoCategorization: true,
          contextAwareness: true,
          proactiveAssistance: true,
          learnFromUsage: true,
          personalizedRecommendations: true,
          dataAnonymization: true,
          modelPreference: 'balanced',
          voiceCommands: false,
          smartScheduling: true,
          priorityDetection: true,
          deadlinePrediction: true,
          habitAnalysis: true
        }
      });
      toast.success('Settings reset to defaults');
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lifeos-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.success('Account deletion request submitted');
    }
  };

  // Apple Reminders Integration Functions
  const connectAppleReminders = async () => {
    setAppleRemindersStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await AppleRemindersService.requestPermission();
      
      if (result.success) {
        setAppleRemindersStatus(prev => ({ 
          ...prev, 
          connected: true, 
          loading: false 
        }));
        
        // Update settings
        setSettings(prev => ({
          ...prev,
          integrations: {
            ...prev.integrations,
            appleReminders: {
              ...prev.integrations.appleReminders,
              enabled: true
            }
          }
        }));
        
        toast.success('Connected to Apple Reminders!');
        
        // Fetch reminder lists
        await fetchReminderLists();
      } else {
        setAppleRemindersStatus(prev => ({ 
          ...prev, 
          loading: false, 
          error: result.error || 'Failed to connect' 
        }));
        toast.error('Failed to connect to Apple Reminders');
      }
    } catch (error) {
      setAppleRemindersStatus(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      toast.error('Error connecting to Apple Reminders');
    }
  };

  const fetchReminderLists = async () => {
    try {
      const result = await AppleRemindersService.getReminderLists();
      if (result.success) {
        setAppleRemindersStatus(prev => ({ 
          ...prev, 
          reminderLists: result.lists 
        }));
      }
    } catch (error) {
      console.error('Failed to fetch reminder lists:', error);
    }
  };

  const importAppleReminders = async (options = {}) => {
    setAppleRemindersStatus(prev => ({ ...prev, loading: true, importProgress: 0 }));
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAppleRemindersStatus(prev => ({ 
          ...prev, 
          importProgress: Math.min(prev.importProgress + 10, 90) 
        }));
      }, 200);

      const result = await AppleRemindersService.importReminders(options);
      
      clearInterval(progressInterval);
      setAppleRemindersStatus(prev => ({ 
        ...prev, 
        loading: false, 
        importProgress: 100 
      }));

      if (result.success) {
        // Actually save the imported tasks to the DataContext
        let savedCount = 0;
        for (const task of result.tasks) {
          try {
            await createTask(task);
            savedCount++;
          } catch (error) {
            console.error('Failed to save task:', task.title, error);
          }
        }
        
        toast.success(`Successfully imported ${savedCount} reminders as tasks!`);
        
        // Update settings
        setSettings(prev => ({
          ...prev,
          integrations: {
            ...prev.integrations,
            appleReminders: {
              ...prev.integrations.appleReminders,
              importCompleted: true,
              lastSync: new Date()
            }
          }
        }));
      } else {
        toast.error(`Import failed: ${result.error}`);
      }
    } catch (error) {
      setAppleRemindersStatus(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      toast.error('Error importing reminders');
    }
  };

  const disconnectAppleReminders = () => {
    AppleRemindersService.disconnect();
    setAppleRemindersStatus({
      connected: false,
      loading: false,
      error: null,
      reminderLists: [],
      importProgress: 0
    });
    
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        appleReminders: {
          ...prev.integrations.appleReminders,
          enabled: false
        }
      }
    }));
    
    toast.success('Disconnected from Apple Reminders');
  };

  // Gmail Integration Functions
  const connectGmail = async () => {
    setGmailStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await GmailService.requestPermission();
      
      if (result.success) {
        setGmailStatus(prev => ({ 
          ...prev, 
          connected: true, 
          loading: false 
        }));
        
        // Update settings
        setSettings(prev => ({
          ...prev,
          integrations: {
            ...prev.integrations,
            gmail: {
              ...prev.integrations.gmail,
              enabled: true
            }
          }
        }));
        
        toast.success('Connected to Gmail!');
        
        // Fetch Gmail labels
        await fetchGmailLabels();
      } else {
        setGmailStatus(prev => ({ 
          ...prev, 
          loading: false, 
          error: result.error || 'Failed to connect' 
        }));
        toast.error('Failed to connect to Gmail');
      }
    } catch (error) {
      setGmailStatus(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      toast.error('Error connecting to Gmail');
    }
  };

  const fetchGmailLabels = async () => {
    try {
      const result = await GmailService.getGmailLabels();
      if (result.success) {
        setGmailStatus(prev => ({ 
          ...prev, 
          labels: result.labels 
        }));
      }
    } catch (error) {
      console.error('Failed to fetch Gmail labels:', error);
    }
  };

  const importGmailEmails = async (options = {}) => {
    setGmailStatus(prev => ({ ...prev, loading: true, importProgress: 0 }));
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGmailStatus(prev => ({ 
          ...prev, 
          importProgress: Math.min(prev.importProgress + 10, 90) 
        }));
      }, 200);

      const result = await GmailService.importEmails(options);
      
      clearInterval(progressInterval);
      setGmailStatus(prev => ({ 
        ...prev, 
        loading: false, 
        importProgress: 100 
      }));

      if (result.success) {
        // Actually save the imported tasks to the DataContext
        let savedCount = 0;
        for (const task of result.tasks) {
          try {
            await createTask(task);
            savedCount++;
          } catch (error) {
            console.error('Failed to save task:', task.title, error);
          }
        }
        
        toast.success(`Successfully imported ${savedCount} emails as tasks!`);
        
        // Update settings
        setSettings(prev => ({
          ...prev,
          integrations: {
            ...prev.integrations,
            gmail: {
              ...prev.integrations.gmail,
              importCompleted: true,
              lastSync: new Date()
            }
          }
        }));
      } else {
        toast.error(`Import failed: ${result.error}`);
      }
    } catch (error) {
      setGmailStatus(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      toast.error('Error importing emails');
    }
  };

  const disconnectGmail = () => {
    GmailService.disconnect();
    setGmailStatus({
      connected: false,
      loading: false,
      error: null,
      labels: [],
      importProgress: 0
    });
    
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        gmail: {
          ...prev.integrations.gmail,
          enabled: false
        }
      }
    }));
    
    toast.success('Disconnected from Gmail');
  };

  // Check Apple Reminders support on component mount
  useEffect(() => {
    const status = AppleRemindersService.getStatus();
    setAppleRemindersStatus(prev => ({ 
      ...prev, 
      connected: status.connected 
    }));
    
    // Check Gmail support
    const gmailStatus = GmailService.getStatus();
    setGmailStatus(prev => ({ 
      ...prev, 
      connected: gmailStatus.connected 
    }));
  }, []);

  const SettingCard = ({ title, description, icon: Icon, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start space-x-4 mb-4">
        <div className="p-2 rounded-lg bg-primary-100">
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          enabled ? 'bg-primary-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Smartphone },
    { id: 'productivity', name: 'Productivity', icon: Zap },
    { id: 'accessibility', name: 'Accessibility', icon: Eye },
    { id: 'advanced', name: 'Advanced', icon: Settings2 },
    { id: 'usage', name: 'Usage & Billing', icon: CreditCard },
    { id: 'ai', name: 'AI Settings', icon: Bot },
    { id: 'data', name: 'Data & Export', icon: Download }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Customize your Life OS experience</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetToDefaults}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={handleSaveSettings}
            className="btn-primary flex items-center space-x-2"
          >
            <Save size={20} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSaveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success-50 border border-success-200 rounded-lg p-4 flex items-center space-x-3"
        >
          <Check className="h-5 w-5 text-success-600" />
          <span className="text-success-800 font-medium">Settings saved successfully!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.name}</span>
                    <ChevronRight size={16} className="ml-auto" />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <>
              <SettingCard
                title="Profile Information"
                description="Update your personal information and account details"
                icon={User}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={settings.profile.avatar}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <button className="btn-secondary text-sm">Change Photo</button>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => handleUpdateSetting('profile', 'name', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleUpdateSetting('profile', 'email', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                      <select
                        value={settings.profile.timezone}
                        onChange={(e) => handleUpdateSetting('profile', 'timezone', e.target.value)}
                        className="input-field"
                      >
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC-7">Mountain Time (UTC-7)</option>
                        <option value="UTC-6">Central Time (UTC-6)</option>
                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                        <option value="UTC+0">UTC</option>
                        <option value="UTC+1">Central European Time (UTC+1)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <select
                        value={settings.profile.language}
                        onChange={(e) => handleUpdateSetting('profile', 'language', e.target.value)}
                        className="input-field"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Chinese">Chinese</option>
                      </select>
                    </div>
                  </div>
                </div>
              </SettingCard>
            </>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <>
              <SettingCard
                title="Email Notifications"
                description="Manage your email notification preferences"
                icon={Mail}
              >
                <div className="space-y-0">
                  <ToggleSwitch
                    enabled={settings.notifications.email}
                    onChange={() => handleToggleSetting('notifications', 'email')}
                    label="Email Notifications"
                    description="Receive notifications via email"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.dailyDigest}
                    onChange={() => handleToggleSetting('notifications', 'dailyDigest')}
                    label="Daily Digest"
                    description="Get a summary of your daily activities"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.weeklyReport}
                    onChange={() => handleToggleSetting('notifications', 'weeklyReport')}
                    label="Weekly Report"
                    description="Receive weekly progress reports"
                  />
                </div>
              </SettingCard>

              <SettingCard
                title="Push Notifications"
                description="Manage your push notification preferences"
                icon={Bell}
              >
                <div className="space-y-0">
                  <ToggleSwitch
                    enabled={settings.notifications.push}
                    onChange={() => handleToggleSetting('notifications', 'push')}
                    label="Push Notifications"
                    description="Receive notifications on your device"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.goalReminders}
                    onChange={() => handleToggleSetting('notifications', 'goalReminders')}
                    label="Goal Reminders"
                    description="Get reminded about your goals"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.habitReminders}
                    onChange={() => handleToggleSetting('notifications', 'habitReminders')}
                    label="Habit Reminders"
                    description="Get reminded about your habits"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.projectUpdates}
                    onChange={() => handleToggleSetting('notifications', 'projectUpdates')}
                    label="Project Updates"
                    description="Get notified about project changes"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.healthReminders}
                    onChange={() => handleToggleSetting('notifications', 'healthReminders')}
                    label="Health Reminders"
                    description="Get reminded about health activities"
                  />
                  <ToggleSwitch
                    enabled={settings.notifications.financeAlerts}
                    onChange={() => handleToggleSetting('notifications', 'financeAlerts')}
                    label="Finance Alerts"
                    description="Get notified about financial activities"
                  />
                </div>
              </SettingCard>
            </>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <>
              <SettingCard
                title="Theme & Display"
                description="Customize the appearance of your Life OS"
                icon={Palette}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleUpdateSetting('appearance', 'theme', 'light')}
                        className={`p-3 rounded-lg border-2 text-center ${
                          settings.appearance.theme === 'light'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                        <span className="text-sm font-medium">Light</span>
                      </button>
                      <button
                        onClick={() => handleUpdateSetting('appearance', 'theme', 'dark')}
                        className={`p-3 rounded-lg border-2 text-center ${
                          settings.appearance.theme === 'dark'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Moon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                        <span className="text-sm font-medium">Dark</span>
                      </button>
                      <button
                        onClick={() => handleUpdateSetting('appearance', 'theme', 'auto')}
                        className={`p-3 rounded-lg border-2 text-center ${
                          settings.appearance.theme === 'auto'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Globe className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <span className="text-sm font-medium">Auto</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                      <select
                        value={settings.appearance.fontSize}
                        onChange={(e) => handleUpdateSetting('appearance', 'fontSize', e.target.value)}
                        className="input-field"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color Scheme</label>
                      <select
                        value={settings.appearance.colorScheme}
                        onChange={(e) => handleUpdateSetting('appearance', 'colorScheme', e.target.value)}
                        className="input-field"
                      >
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="purple">Purple</option>
                        <option value="orange">Orange</option>
                      </select>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.appearance.compactMode}
                    onChange={() => handleToggleSetting('appearance', 'compactMode')}
                    label="Compact Mode"
                    description="Reduce spacing for more content"
                  />
                  <ToggleSwitch
                    enabled={settings.appearance.showAnimations}
                    onChange={() => handleToggleSetting('appearance', 'showAnimations')}
                    label="Show Animations"
                    description="Enable smooth transitions and animations"
                  />
                </div>
              </SettingCard>
            </>
          )}

          {/* Privacy & Security Settings */}
          {activeTab === 'privacy' && (
            <>
              <SettingCard
                title="Privacy Settings"
                description="Control your privacy and data sharing preferences"
                icon={Eye}
              >
                <div className="space-y-0">
                  <div className="py-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Visibility</label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => handleUpdateSetting('privacy', 'profileVisibility', e.target.value)}
                      className="input-field"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <ToggleSwitch
                    enabled={settings.privacy.dataSharing}
                    onChange={() => handleToggleSetting('privacy', 'dataSharing')}
                    label="Data Sharing"
                    description="Allow sharing of anonymous usage data"
                  />
                  <ToggleSwitch
                    enabled={settings.privacy.analytics}
                    onChange={() => handleToggleSetting('privacy', 'analytics')}
                    label="Analytics"
                    description="Help improve Life OS with usage analytics"
                  />
                  <ToggleSwitch
                    enabled={settings.privacy.locationServices}
                    onChange={() => handleToggleSetting('privacy', 'locationServices')}
                    label="Location Services"
                    description="Allow access to your location"
                  />
                  <ToggleSwitch
                    enabled={settings.privacy.thirdPartyCookies}
                    onChange={() => handleToggleSetting('privacy', 'thirdPartyCookies')}
                    label="Third-party Cookies"
                    description="Allow third-party cookies for enhanced features"
                  />
                </div>
              </SettingCard>

              <SettingCard
                title="Security"
                description="Manage your account security settings"
                icon={Shield}
              >
                <div className="space-y-4">
                  <button className="btn-secondary w-full flex items-center justify-between">
                    <span>Change Password</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="btn-secondary w-full flex items-center justify-between">
                    <span>Two-Factor Authentication</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="btn-secondary w-full flex items-center justify-between">
                    <span>Login History</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="btn-secondary w-full flex items-center justify-between">
                    <span>Connected Devices</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </SettingCard>
            </>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <>
              <SettingCard
                title="Apple Reminders Integration"
                description="Connect and sync with Apple Reminders on your iPhone, iPad, or Mac"
                icon={Smartphone}
              >
                <div className="space-y-4">
                  {/* Connection Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {appleRemindersStatus.connected ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {appleRemindersStatus.connected ? 'Connected' : 'Not Connected'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {appleRemindersStatus.connected 
                            ? `Last sync: ${settings.integrations.appleReminders.lastSync ? 
                                new Date(settings.integrations.appleReminders.lastSync).toLocaleString() : 
                                'Never'}`
                            : 'Connect to import your Apple Reminders'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {appleRemindersStatus.connected ? (
                        <>
                          <button
                            onClick={() => importAppleReminders()}
                            disabled={appleRemindersStatus.loading}
                            className="btn-primary text-sm flex items-center space-x-1"
                          >
                            <Upload size={14} />
                            <span>Import</span>
                          </button>
                          <button
                            onClick={disconnectAppleReminders}
                            className="btn-secondary text-sm flex items-center space-x-1"
                          >
                            <X size={14} />
                            <span>Disconnect</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={connectAppleReminders}
                          disabled={appleRemindersStatus.loading}
                          className="btn-primary text-sm flex items-center space-x-1"
                        >
                          {appleRemindersStatus.loading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Wifi size={14} />
                          )}
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Import Progress */}
                  {appleRemindersStatus.loading && appleRemindersStatus.importProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Importing reminders...</span>
                        <span className="text-gray-600">{appleRemindersStatus.importProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${appleRemindersStatus.importProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Reminder Lists */}
                  {appleRemindersStatus.connected && appleRemindersStatus.reminderLists.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Available Lists</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {appleRemindersStatus.reminderLists.map((list, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Target className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-900">{list.name}</span>
                              <span className="text-xs text-gray-500">({list.count} items)</span>
                            </div>
                            <button
                              onClick={() => importAppleReminders({ list: list.name })}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              Import
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Import Options */}
                  {appleRemindersStatus.connected && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Import Options</h4>
                      <div className="space-y-2">
                        <ToggleSwitch
                          enabled={settings.integrations.appleReminders.importCompleted}
                          onChange={() => handleToggleSetting('integrations', 'appleReminders')}
                          label="Import Completed Tasks"
                          description="Include already completed reminders in the import"
                        />
                        <ToggleSwitch
                          enabled={settings.integrations.appleReminders.autoSync}
                          onChange={() => handleToggleSetting('integrations', 'appleReminders')}
                          label="Auto Sync"
                          description="Automatically sync changes between FlowState and Apple Reminders"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sync Frequency</label>
                        <select
                          value={settings.integrations.appleReminders.syncFrequency}
                          onChange={(e) => handleUpdateSetting('integrations', 'appleReminders', e.target.value)}
                          className="input-field"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="manual">Manual Only</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {appleRemindersStatus.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{appleRemindersStatus.error}</p>
                    </div>
                  )}
                </div>
              </SettingCard>

              <SettingCard
                title="Other Integrations"
                description="Connect with other productivity tools and services"
                icon={Globe}
              >
                <div className="space-y-4">
                  {/* Gmail Integration */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {gmailStatus.connected ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {gmailStatus.connected ? 'Connected' : 'Not Connected'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {gmailStatus.connected 
                            ? `Last sync: ${settings.integrations.gmail.lastSync ? 
                                new Date(settings.integrations.gmail.lastSync).toLocaleString() : 
                                'Never'}`
                            : 'Connect to import emails as tasks'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {gmailStatus.connected ? (
                        <>
                          <button
                            onClick={() => importGmailEmails()}
                            disabled={gmailStatus.loading}
                            className="btn-primary text-sm flex items-center space-x-1"
                          >
                            <Upload size={14} />
                            <span>Import</span>
                          </button>
                          <button
                            onClick={disconnectGmail}
                            className="btn-secondary text-sm flex items-center space-x-1"
                          >
                            <X size={14} />
                            <span>Disconnect</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={connectGmail}
                          disabled={gmailStatus.loading}
                          className="btn-primary text-sm flex items-center space-x-1"
                        >
                          {gmailStatus.loading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Mail size={14} />
                          )}
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Import Progress */}
                  {gmailStatus.loading && gmailStatus.importProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Importing emails...</span>
                        <span className="text-gray-600">{gmailStatus.importProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${gmailStatus.importProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Gmail Labels */}
                  {gmailStatus.connected && gmailStatus.labels.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Available Labels:</p>
                      <div className="flex flex-wrap gap-2">
                        {gmailStatus.labels.map((label, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {label.name} ({label.count})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Google Calendar */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Google Calendar</p>
                        <p className="text-xs text-gray-500">Sync events and deadlines</p>
                      </div>
                    </div>
                    <button className="btn-secondary text-sm">Connect</button>
                  </div>

                  {/* Notion */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Notion</p>
                        <p className="text-xs text-gray-500">Import pages and databases</p>
                      </div>
                    </div>
                    <button className="btn-secondary text-sm">Connect</button>
                  </div>

                  {/* Todoist */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Todoist</p>
                        <p className="text-xs text-gray-500">Import tasks and projects</p>
                      </div>
                    </div>
                    <button className="btn-secondary text-sm">Connect</button>
                  </div>

                  {/* Slack */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Slack</p>
                        <p className="text-xs text-gray-500">Sync messages and tasks</p>
                      </div>
                    </div>
                    <button className="btn-secondary text-sm">Connect</button>
                  </div>
                </div>
              </SettingCard>
            </>
          )}

          {/* Usage & Billing Settings */}
          {activeTab === 'usage' && (
            <UsageDashboard />
          )}

          {/* AI Settings */}
          {activeTab === 'ai' && (
            <>
              <SettingCard
                title="AI Assistant Configuration"
                description="Configure your AI assistant preferences and behavior"
                icon={Bot}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AI Model Preference</label>
                    <select className="input-field">
                      <option value="gpt-4">GPT-4 (Recommended)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                      <option value="claude">Claude (Alternative)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Response Style</label>
                    <select className="input-field">
                      <option value="concise">Concise</option>
                      <option value="detailed">Detailed</option>
                      <option value="conversational">Conversational</option>
                    </select>
                  </div>
                  <div className="space-y-0">
                    <ToggleSwitch
                      enabled={true}
                      onChange={() => {}}
                      label="Enable AI Suggestions"
                      description="Get AI-powered recommendations and insights"
                    />
                    <ToggleSwitch
                      enabled={true}
                      onChange={() => {}}
                      label="Auto-analyze Data"
                      description="Automatically analyze your data for patterns and insights"
                    />
                    <ToggleSwitch
                      enabled={false}
                      onChange={() => {}}
                      label="Share Data for Training"
                      description="Help improve AI by sharing anonymized usage data"
                    />
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="AI Usage Analytics"
                description="Monitor your AI usage and get insights"
                icon={TrendingUp}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700">AI Requests</h4>
                      <p className="text-2xl font-bold text-gray-900">247</p>
                      <p className="text-xs text-gray-500">This month</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700">Tokens Used</h4>
                      <p className="text-2xl font-bold text-gray-900">125K</p>
                      <p className="text-xs text-gray-500">This month</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700">Most Used Feature</h4>
                      <p className="text-lg font-semibold text-gray-900">Goal Analysis</p>
                      <p className="text-xs text-gray-500">45 requests</p>
                    </div>
                  </div>
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-primary-800 mb-2">AI Insights</h4>
                    <p className="text-sm text-primary-600">
                      Your AI usage shows you're most productive in the morning. Consider scheduling important tasks during this time.
                    </p>
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="AI Feature Preferences"
                description="Customize which AI features are enabled"
                icon={Zap}
              >
                <div className="space-y-0">
                  <ToggleSwitch
                    enabled={true}
                    onChange={() => {}}
                    label="Goal Analysis"
                    description="AI-powered goal optimization and recommendations"
                  />
                  <ToggleSwitch
                    enabled={true}
                    onChange={() => {}}
                    label="Project Insights"
                    description="Project timeline analysis and risk assessment"
                  />
                  <ToggleSwitch
                    enabled={true}
                    onChange={() => {}}
                    label="Habit Recommendations"
                    description="Personalized habit suggestions and optimization"
                  />
                  <ToggleSwitch
                    enabled={true}
                    onChange={() => {}}
                    label="Financial Analysis"
                    description="Spending pattern analysis and budget optimization"
                  />
                  <ToggleSwitch
                    enabled={false}
                    onChange={() => {}}
                    label="Health Insights"
                    description="Health data analysis and wellness recommendations"
                  />
                  <ToggleSwitch
                    enabled={true}
                    onChange={() => {}}
                    label="Learning Path Optimization"
                    description="Skill development recommendations and course suggestions"
                  />
                </div>
              </SettingCard>
            </>
          )}

          {/* Data & Export Settings */}
          {activeTab === 'productivity' && (
            <>
              <SettingCard
                title="Focus & Productivity"
                description="Configure focus modes and productivity tools"
                icon={Zap}
              >
                <div className="space-y-4">
                  <ToggleSetting
                    title="Focus Mode"
                    description="Block distractions during work sessions"
                    enabled={settings.productivity.focusMode}
                    onToggle={() => handleToggleSetting('productivity', 'focusMode')}
                  />
                  <ToggleSetting
                    title="Pomodoro Timer"
                    description="Use Pomodoro technique for time management"
                    enabled={settings.productivity.pomodoroTimer}
                    onToggle={() => handleToggleSetting('productivity', 'pomodoroTimer')}
                  />
                  <ToggleSetting
                    title="Break Reminders"
                    description="Get notified to take regular breaks"
                    enabled={settings.productivity.breakReminders}
                    onToggle={() => handleToggleSetting('productivity', 'breakReminders')}
                  />
                  <ToggleSetting
                    title="Auto Archive"
                    description="Automatically archive completed tasks"
                    enabled={settings.productivity.autoArchive}
                    onToggle={() => handleToggleSetting('productivity', 'autoArchive')}
                  />
                  <ToggleSetting
                    title="Smart Suggestions"
                    description="Get AI-powered productivity suggestions"
                    enabled={settings.productivity.smartSuggestions}
                    onToggle={() => handleToggleSetting('productivity', 'smartSuggestions')}
                  />
                  <ToggleSetting
                    title="Time Tracking"
                    description="Track time spent on tasks and projects"
                    enabled={settings.productivity.timeTracking}
                    onToggle={() => handleToggleSetting('productivity', 'timeTracking')}
                  />
                  <ToggleSetting
                    title="Distraction Blocking"
                    description="Block distracting websites during focus time"
                    enabled={settings.productivity.distractionBlocking}
                    onToggle={() => handleToggleSetting('productivity', 'distractionBlocking')}
                  />
                </div>
              </SettingCard>

              <SettingCard
                title="Work Schedule"
                description="Set your working hours and preferences"
                icon={Clock}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Start Time
                      </label>
                      <input
                        type="time"
                        value={settings.productivity.workHours.start}
                        onChange={(e) => handleUpdateSetting('productivity', 'workHours', {
                          ...settings.productivity.workHours,
                          start: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work End Time
                      </label>
                      <input
                        type="time"
                        value={settings.productivity.workHours.end}
                        onChange={(e) => handleUpdateSetting('productivity', 'workHours', {
                          ...settings.productivity.workHours,
                          end: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <ToggleSetting
                    title="Weekend Mode"
                    description="Enable relaxed productivity mode on weekends"
                    enabled={settings.productivity.weekendMode}
                    onToggle={() => handleToggleSetting('productivity', 'weekendMode')}
                  />
                </div>
              </SettingCard>
            </>
          )}

          {activeTab === 'accessibility' && (
            <>
              <SettingCard
                title="Visual Accessibility"
                description="Customize visual elements for better accessibility"
                icon={Eye}
              >
                <div className="space-y-4">
                  <ToggleSetting
                    title="High Contrast Mode"
                    description="Increase contrast for better visibility"
                    enabled={settings.accessibility.highContrast}
                    onToggle={() => handleToggleSetting('accessibility', 'highContrast')}
                  />
                  <ToggleSetting
                    title="Reduced Motion"
                    description="Minimize animations and transitions"
                    enabled={settings.accessibility.reducedMotion}
                    onToggle={() => handleToggleSetting('accessibility', 'reducedMotion')}
                  />
                  <ToggleSetting
                    title="Color Blind Support"
                    description="Use color-blind friendly palettes"
                    enabled={settings.accessibility.colorBlindSupport}
                    onToggle={() => handleToggleSetting('accessibility', 'colorBlindSupport')}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size
                    </label>
                    <select
                      value={settings.accessibility.fontSize}
                      onChange={(e) => handleUpdateSetting('accessibility', 'fontSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="extra-large">Extra Large</option>
                    </select>
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Navigation & Interaction"
                description="Configure navigation and interaction preferences"
                icon={MousePointer}
              >
                <div className="space-y-4">
                  <ToggleSetting
                    title="Keyboard Navigation"
                    description="Enable full keyboard navigation support"
                    enabled={settings.accessibility.keyboardNavigation}
                    onToggle={() => handleToggleSetting('accessibility', 'keyboardNavigation')}
                  />
                  <ToggleSetting
                    title="Screen Reader Support"
                    description="Optimize for screen readers"
                    enabled={settings.accessibility.screenReader}
                    onToggle={() => handleToggleSetting('accessibility', 'screenReader')}
                  />
                  <ToggleSetting
                    title="Voice Over Support"
                    description="Enhanced support for VoiceOver"
                    enabled={settings.accessibility.voiceOver}
                    onToggle={() => handleToggleSetting('accessibility', 'voiceOver')}
                  />
                </div>
              </SettingCard>
            </>
          )}

          {activeTab === 'advanced' && (
            <>
              <SettingCard
                title="Developer Options"
                description="Advanced settings for power users and developers"
                icon={Settings2}
              >
                <div className="space-y-4">
                  <ToggleSetting
                    title="Debug Mode"
                    description="Enable detailed logging and debugging information"
                    enabled={settings.advanced.debugMode}
                    onToggle={() => handleToggleSetting('advanced', 'debugMode')}
                  />
                  <ToggleSetting
                    title="Beta Features"
                    description="Access experimental features in development"
                    enabled={settings.advanced.betaFeatures}
                    onToggle={() => handleToggleSetting('advanced', 'betaFeatures')}
                  />
                  <ToggleSetting
                    title="Experimental AI"
                    description="Try cutting-edge AI features"
                    enabled={settings.advanced.experimentalAI}
                    onToggle={() => handleToggleSetting('advanced', 'experimentalAI')}
                  />
                  <ToggleSetting
                    title="Offline Mode"
                    description="Enable offline functionality"
                    enabled={settings.advanced.offlineMode}
                    onToggle={() => handleToggleSetting('advanced', 'offlineMode')}
                  />
                </div>
              </SettingCard>

              <SettingCard
                title="Performance Settings"
                description="Optimize app performance and resource usage"
                icon={Activity}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Performance Mode
                    </label>
                    <select
                      value={settings.advanced.performanceMode}
                      onChange={(e) => handleUpdateSetting('advanced', 'performanceMode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="power-save">Power Save</option>
                      <option value="balanced">Balanced</option>
                      <option value="performance">High Performance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cache Size
                    </label>
                    <select
                      value={settings.advanced.cacheSize}
                      onChange={(e) => handleUpdateSetting('advanced', 'cacheSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="small">Small (50MB)</option>
                      <option value="medium">Medium (100MB)</option>
                      <option value="large">Large (250MB)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sync Frequency
                    </label>
                    <select
                      value={settings.advanced.syncFrequency}
                      onChange={(e) => handleUpdateSetting('advanced', 'syncFrequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="manual">Manual</option>
                      <option value="hourly">Hourly</option>
                      <option value="real-time">Real-time</option>
                    </select>
                  </div>
                </div>
              </SettingCard>
            </>
          )}

          {activeTab === 'data' && (
            <>
              <SettingCard
                title="Data Management"
                description="Manage your data backup and export preferences"
                icon={Download}
              >
                <div className="space-y-0">
                  <ToggleSwitch
                    enabled={settings.data.autoBackup}
                    onChange={() => handleToggleSetting('data', 'autoBackup')}
                    label="Auto Backup"
                    description="Automatically backup your data"
                  />
                  <div className="py-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                    <select
                      value={settings.data.backupFrequency}
                      onChange={(e) => handleUpdateSetting('data', 'backupFrequency', e.target.value)}
                      className="input-field"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="py-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention</label>
                    <select
                      value={settings.data.dataRetention}
                      onChange={(e) => handleUpdateSetting('data', 'dataRetention', e.target.value)}
                      className="input-field"
                    >
                      <option value="1 year">1 Year</option>
                      <option value="2 years">2 Years</option>
                      <option value="5 years">5 Years</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Export & Import"
                description="Export your data or import from other sources"
                icon={Download}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
                    <select
                      value={settings.data.exportFormat}
                      onChange={(e) => handleUpdateSetting('data', 'exportFormat', e.target.value)}
                      className="input-field"
                    >
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleExportData}
                      className="btn-primary flex items-center justify-center space-x-2"
                    >
                      <Download size={16} />
                      <span>Export Data</span>
                    </button>
                    <button className="btn-secondary flex items-center justify-center space-x-2">
                      <Download size={16} />
                      <span>Import Data</span>
                    </button>
                  </div>
                </div>
              </SettingCard>

              <SettingCard
                title="Danger Zone"
                description="Irreversible and destructive actions"
                icon={Trash2}
              >
                <div className="space-y-4">
                  <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                    <h4 className="text-sm font-medium text-danger-800 mb-2">Delete Account</h4>
                    <p className="text-sm text-danger-600 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="btn-danger text-sm"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </SettingCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
