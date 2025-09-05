import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Target, CheckCircle, TrendingUp, Clock, Calendar,
  BarChart3, Activity, Star, Brain, Mic, Sparkles, 
  ArrowRight, Zap, Timer, Award, Rocket, Lightbulb,
  Users, DollarSign, BookOpen, Heart, Inbox, Filter, Search, Bell,
  Settings, RefreshCw, Eye, EyeOff, Grid, List,
  Layout, Home, Navigation, Compass, Map, MapPin, Route, Car, Plane,
  Train, Bus, Bike, Walk, Run, Dumbbell, Coffee, Utensils, Apple, Pizza,
  Cake, Wine, Beer, Tea, Milk, Water, Juice, Soda, IceCream, Cookie,
  Bread, Egg, Fish, Meat, Vegetable, Fruit, Salad, Soup, Sandwich,
  Burger, HotDog, Taco, Burrito, Sushi, Pasta, Rice, Noodles, Cheese,
  Butter, Oil, Salt, Pepper, Sugar, Honey, Jam, Nut, Seed, Bean, Corn,
  Potato, Tomato, Onion, Garlic, Carrot, Broccoli, Spinach, Lettuce,
  Cucumber, Pepper as PepperIcon, Mushroom, Avocado, Lemon, Lime, Orange,
  Banana, Strawberry, Grape, Cherry, Peach, Pear, Apple as AppleIcon,
  Pineapple, Mango, Kiwi, Watermelon, Melon, Coconut, Pomegranate, Fig,
  Raisin, Cranberry, Blueberry, Raspberry, Blackberry, Plum, Apricot,
  Nectarine, Persimmon, Papaya, Guava, Passion, Dragon, Lychee, Rambutan,
  Durian, Jackfruit, Breadfruit, Plantain, Yam, Sweet, Beet, Radish,
  Turnip, Cabbage, Cauliflower, Brussels, Asparagus, Artichoke, Leek,
  Scallion, Chive, Parsley, Cilantro, Basil, Oregano, Thyme, Rosemary,
  Sage, Mint, Dill, Tarragon, Bay, Cinnamon, Nutmeg, Clove, Cardamom,
  Ginger, Turmeric, Cumin, Coriander, Fennel, Anise, Mustard, Sesame,
  Poppy, Sunflower, Pumpkin, Chia, Flax, Hemp, Quinoa, Buckwheat, Millet,
  Barley, Oats, Wheat, Rye, Spelt, Amaranth, Teff, Sorghum, Triticale,
  Kamut, Farro, Bulgur, Couscous, Polenta, Grits, Semolina, Tapioca,
  Arrowroot, Cornstarch, Flour, Baking, Powder, Soda as SodaIcon, Yeast,
  Vanilla, Almond, Extract, Cocoa, Chocolate, Dark, Milk as MilkIcon,
  White, Caramel, Toffee, Fudge, Nougat, Marshmallow, Jelly, Gummy,
  Lollipop, Candy, Gum, Mint as MintIcon, Peppermint, Spearmint,
  Wintergreen, Eucalyptus, Lavender, Rose, Jasmine, Chamomile, Hibiscus,
  Rooibos, Matcha, Green, Black, White as WhiteIcon, Oolong, Pu, Erh,
  Chai, Earl, Grey, English, Breakfast, Darjeeling, Assam, Ceylon,
  Keemun, Lapsang, Souchong, Gunpowder, Sencha, Gyokuro, Bancha,
  Hojicha, Genmaicha, Kukicha, Konacha, Mecha, Tamaryokucha, Kabusecha,
  Tencha, Shincha, Ichibancha, Nibancha, Sanbancha, Yonbancha, Gobancha,
  Roku, Bancha as BanchaIcon, Shichibancha, Hachibancha, Kyubancha,
  Jubancha, Juichibancha, Junibancha, Jusanbancha, Juyonbancha,
  Jugobancha, Jurokubancha, Jushichibancha, Juhachibancha, Jukyubancha,
  Nijubancha, Nijuuichibancha, Nijuunibancha, Nijuusanbancha,
  Nijuuyonbancha, Nijuugobancha, Nijuu, Rokubancha, Nijuushichibancha,
  Nijuuhachibancha, Nijuukyubancha, Sanjuubancha, Sanjuuichibancha,
  Sanjuunibancha, Sanjuusanbancha, Sanjuuyonbancha, Sanjuugobancha,
  Sanjuurokubancha, Sanjuushichibancha, Sanjuuhachibancha,
  Sanjuukyubancha, Yonjuubancha, Yonjuuichibancha, Yonjuunibancha,
  Yonjuusanbancha, Yonjuuyonbancha, Yonjuugobancha, Yonjuurokubancha,
  Yonjuushichibancha, Yonjuuhachibancha, Yonjuukyubancha,
  Gojuubancha, Gojuuichibancha, Gojuunibancha, Gojuusanbancha,
  Gojuuyonbancha, Gojuugobancha, Gojuurokubancha, Gojuushichibancha,
  Gojuuhachibancha, Gojuukyubancha, Rokujuubancha, Rokujuuichibancha,
  Rokujuunibancha, Rokujuusanbancha, Rokujuuyonbancha, Rokujuugobancha,
  Rokujuurokubancha, Rokujuushichibancha, Rokujuuhachibancha,
  Rokujuukyubancha, Nanajuubancha, Nanajuuichibancha, Nanajuunibancha,
  Nanajuusanbancha, Nanajuuyonbancha, Nanajuugobancha, Nanajuurokubancha,
  Nanajuushichibancha, Nanajuuhachibancha, Nanajuukyubancha,
  Hachijuubancha, Hachijuuichibancha, Hachijuunibancha,
  Hachijuusanbancha, Hachijuuyonbancha, Hachijuugobancha,
  Hachijuurokubancha, Hachijuushichibancha, Hachijuuhachibancha,
  Hachijuukyubancha, Kyuujuubancha, Kyuujuuichibancha, Kyuujuunibancha,
  Kyuujuusanbancha, Kyuujuuyonbancha, Kyuujuugobancha, Kyuujuurokubancha,
  Kyuujuushichibancha, Kyuujuuhachibancha, Kyuujuukyubancha, Hyaku,
  Bancha as HyakuBancha, Tag
} from 'lucide-react';
import DailyBriefing from '../components/DailyBriefing';
import FlowStateLogo from '../components/FlowStateLogo';
import CustomizeModal from '../components/CustomizeModal';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    areas, 
    projects, 
    tasks, 
    resources, 
    archives, 
    goals, 
    habits,
    loading,
    getRelatedData 
  } = useData();
  
  const navigate = useNavigate();
  const [quickCapture, setQuickCapture] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  // Calculate metrics
  const completedToday = tasks.filter(task => 
    task.status === 'completed' && 
    new Date(task.updatedAt).toDateString() === new Date().toDateString()
  ).length;

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;
  const activeProjects = projects.filter(project => project.status === 'active').length;
  const inboxCount = tasks.filter(task => task.status === 'inbox').length;
  const overdueTasks = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
  ).length;

  const todayFocus = tasks.filter(task => 
    task.priority === 'high' && 
    task.status !== 'completed' &&
    (!task.dueDate || new Date(task.dueDate).toDateString() === new Date().toDateString())
  ).slice(0, 5);

  // Set time of day and load theme
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    // Load saved theme
    const savedTheme = localStorage.getItem('dashboardTheme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Handle theme change
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  // Quick capture handler
  const handleQuickCapture = async (e) => {
    e.preventDefault();
    if (!quickCapture.trim()) return;
    
    // Here you would typically call an API to create a task
    console.log('Quick capture:', quickCapture);
    setQuickCapture('');
    
    // Navigate to inbox to see the captured item
    navigate('/inbox');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SkeletonLoader type="text" lines={1} width="200px" height="2rem" />
            </div>
            <SkeletonLoader type="button" width="120px" height="2.5rem" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-6 space-y-6">
          {/* Daily Briefing Skeleton */}
          <SkeletonLoader type="card" width="100%" height="200px" />
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonLoader key={index} type="card" width="100%" height="120px" />
            ))}
          </div>

          {/* Today's Focus Skeleton */}
          <SkeletonLoader type="card" width="100%" height="300px" />

          {/* Quick Actions Skeleton */}
          <SkeletonLoader type="card" width="100%" height="150px" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 dashboard-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Good {timeOfDay}, {user?.name || 'User'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCustomizeModal(true)}
              className="customize-button flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Customize</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Daily Briefing */}
        <DailyBriefing 
          completedToday={completedToday}
          dueToday={tasks.filter(task => 
            task.dueDate && 
            new Date(task.dueDate).toDateString() === new Date().toDateString() &&
            task.status !== 'completed'
          ).length}
          overdueTasks={overdueTasks}
          activeStreaks={habits.filter(habit => habit.streak > 0).length}
        />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inbox Items</p>
                <p className="text-2xl font-bold text-gray-900">{inboxCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Inbox className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Focus */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today's Focus</h2>
            <button
              onClick={() => navigate('/tasks')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          
          {todayFocus.length > 0 ? (
            <div className="space-y-3">
              {todayFocus.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.project?.name}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {task.dueDate && new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No high-priority tasks for today</p>
              <button
                onClick={() => navigate('/tasks')}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Add some tasks
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/inbox')}
              className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Inbox className="w-6 h-6 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Inbox</span>
            </button>
            
            <button
              onClick={() => navigate('/tasks')}
              className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CheckCircle className="w-6 h-6 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Tasks</span>
            </button>
            
            <button
              onClick={() => navigate('/projects')}
              className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Target className="w-6 h-6 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Projects</span>
            </button>
            
            <button
              onClick={() => navigate('/calendar')}
              className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Calendar className="w-6 h-6 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customize Modal */}
      <CustomizeModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
};

export default Dashboard;