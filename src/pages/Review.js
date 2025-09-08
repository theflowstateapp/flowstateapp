import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Star,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  Save,
  Loader,
  ChevronDown,
  ChevronUp,
  Zap,
  Timer,
  Brain
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects, useTasks, useAreas } from '../hooks/useSupabase';
import { FlowMetricsSection } from '../components/FlowMetrics';
import toast from 'react-hot-toast';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

const Review = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewData, setReviewData] = useState({
    week_start: '',
    accomplishments: '',
    challenges: '',
    lessons_learned: '',
    next_week_goals: '',
    rating: 5
  });
  const [expandedSections, setExpandedSections] = useState({
    accomplishments: true,
    challenges: true,
    lessons: true,
    goals: true
  });
  
  const { user } = useAuth();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const { areas } = useAreas();

  // Get week dates
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Sample review data (in real app, this would come from database)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      week_start: '2024-01-01',
      accomplishments: 'Completed project planning, exercised 5 days, read 2 books',
      challenges: 'Had trouble with time management on Tuesday',
      lessons_learned: 'Breaking tasks into smaller chunks helps with focus',
      next_week_goals: 'Start new project, increase exercise intensity, finish current book',
      rating: 4
    }
  ]);

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const handleSaveReview = () => {
    const newReview = {
      id: Date.now(),
      week_start: format(weekStart, 'yyyy-MM-dd'),
      ...reviewData
    };
    setReviews(prev => [...prev, newReview]);
    setShowAddReview(false);
    setReviewData({
      week_start: '',
      accomplishments: '',
      challenges: '',
      lessons_learned: '',
      next_week_goals: '',
      rating: 5
    });
    toast.success('Weekly review saved successfully!');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getWeekStats = () => {
    const completedTasks = tasks.filter(task => 
      task.status === 'completed' && 
      new Date(task.completed_at) >= weekStart &&
      new Date(task.completed_at) <= weekEnd
    ).length;

    const activeProjects = projects.filter(project => 
      project.status === 'in_progress'
    ).length;

    return {
      completedTasks,
      activeProjects,
      totalTasks: tasks.length,
      totalProjects: projects.length
    };
  };

  const stats = getWeekStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="mr-3 text-purple-500" size={32} />
            Weekly Review
          </h1>
          <p className="text-gray-600 mt-1">Weekly reflection and planning</p>
        </div>
        <button
          onClick={() => setShowAddReview(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Review</span>
        </button>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousWeek}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h2>
          <button
            onClick={handleNextWeek}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Week Overview */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-center ${
                isToday(day) 
                  ? 'bg-purple-100 border-2 border-purple-500' 
                  : 'bg-gray-50'
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">
                {format(day, 'EEE')}
              </div>
              <div className={`font-medium ${
                isToday(day) ? 'text-purple-700' : 'text-gray-900'
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-blue-700">{stats.completedTasks}</p>
              </div>
              <CheckCircle className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Active Projects</p>
                <p className="text-2xl font-bold text-green-700">{stats.activeProjects}</p>
              </div>
              <Target className="text-green-500" size={24} />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total Tasks</p>
                <p className="text-2xl font-bold text-purple-700">{stats.totalTasks}</p>
              </div>
              <Clock className="text-purple-500" size={24} />
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Total Projects</p>
                <p className="text-2xl font-bold text-orange-700">{stats.totalProjects}</p>
              </div>
              <TrendingUp className="text-orange-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Flow Metrics */}
      <FlowMetricsSection />

      {/* Review Form */}
      {showAddReview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Review</h3>
          
          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Week Rating (1-5)
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setReviewData(prev => ({ ...prev, rating }))}
                    className={`p-2 rounded-lg ${
                      reviewData.rating >= rating
                        ? 'text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  >
                    <Star size={20} fill={reviewData.rating >= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Accomplishments */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('accomplishments')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Accomplishments
                </label>
                {expandedSections.accomplishments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSections.accomplishments && (
                <textarea
                  value={reviewData.accomplishments}
                  onChange={(e) => setReviewData(prev => ({ ...prev, accomplishments: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="What did you accomplish this week?"
                />
              )}
            </div>

            {/* Challenges */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('challenges')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Challenges
                </label>
                {expandedSections.challenges ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSections.challenges && (
                <textarea
                  value={reviewData.challenges}
                  onChange={(e) => setReviewData(prev => ({ ...prev, challenges: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="What challenges did you face?"
                />
              )}
            </div>

            {/* Lessons Learned */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('lessons')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Lessons Learned
                </label>
                {expandedSections.lessons ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSections.lessons && (
                <textarea
                  value={reviewData.lessons_learned}
                  onChange={(e) => setReviewData(prev => ({ ...prev, lessons_learned: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="What did you learn this week?"
                />
              )}
            </div>

            {/* Next Week Goals */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('goals')}
                className="flex items-center justify-between w-full text-left mb-2"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Next Week Goals
                </label>
                {expandedSections.goals ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSections.goals && (
                <textarea
                  value={reviewData.next_week_goals}
                  onChange={(e) => setReviewData(prev => ({ ...prev, next_week_goals: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="What are your goals for next week?"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowAddReview(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveReview}
              className="btn-primary flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Review</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Previous Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Previous Reviews</h3>
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Week of {format(new Date(review.week_start), 'MMM d, yyyy')}
              </h4>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star
                      key={rating}
                      size={16}
                      className={rating <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({review.rating}/5)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Accomplishments</h5>
                <p className="text-gray-600 text-sm">{review.accomplishments}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Challenges</h5>
                <p className="text-gray-600 text-sm">{review.challenges}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Lessons Learned</h5>
                <p className="text-gray-600 text-sm">{review.lessons_learned}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Next Week Goals</h5>
                <p className="text-gray-600 text-sm">{review.next_week_goals}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Review;

