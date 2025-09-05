import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Activity,
  Dumbbell,
  Zap,
  Bike,
  Waves,
  Sparkles,
  Save,
  X,
  Loader,
  CheckCircle,
  Circle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Workouts = () => {
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'strength',
    duration: 30,
    calories: 0,
    notes: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const { user } = useAuth();

  const workoutTypes = [
    { value: 'strength', label: 'Strength Training', icon: Dumbbell, color: 'text-blue-500' },
    { value: 'cardio', label: 'Cardio', icon: Zap, color: 'text-green-500' },
    { value: 'cycling', label: 'Cycling', icon: Bike, color: 'text-purple-500' },
    { value: 'swimming', label: 'Swimming', icon: Waves, color: 'text-cyan-500' },
    { value: 'yoga', label: 'Yoga', icon: Sparkles, color: 'text-pink-500' },
    { value: 'other', label: 'Other', icon: Activity, color: 'text-gray-500' }
  ];

  // Sample workout data (in real app, this would come from database)
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      name: 'Morning Strength',
      type: 'strength',
      duration: 45,
      calories: 320,
      notes: 'Upper body focus, felt strong today',
      date: '2024-01-15',
      created_at: '2024-01-15T08:00:00Z'
    },
    {
      id: 2,
      name: 'Evening Run',
      type: 'cardio',
      duration: 30,
      calories: 280,
      notes: '5km run, good pace',
      date: '2024-01-14',
      created_at: '2024-01-14T18:30:00Z'
    },
    {
      id: 3,
      name: 'Yoga Session',
      type: 'yoga',
      duration: 60,
      calories: 150,
      notes: 'Vinyasa flow, very relaxing',
      date: '2024-01-13',
      created_at: '2024-01-13T07:00:00Z'
    }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a workout name');
      return;
    }

    try {
      if (editingWorkout) {
        const updatedWorkouts = workouts.map(w => 
          w.id === editingWorkout.id ? { ...w, ...formData } : w
        );
        setWorkouts(updatedWorkouts);
        toast.success('Workout updated successfully!');
      } else {
        const newWorkout = {
          id: Date.now(),
          ...formData,
          created_at: new Date().toISOString()
        };
        setWorkouts(prev => [newWorkout, ...prev]);
        toast.success('Workout added successfully!');
      }
      setShowAddWorkout(false);
      setEditingWorkout(null);
      setFormData({
        name: '',
        type: 'strength',
        duration: 30,
        calories: 0,
        notes: '',
        date: format(new Date(), 'yyyy-MM-dd')
      });
    } catch (error) {
      toast.error('Failed to save workout');
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      name: workout.name,
      type: workout.type,
      duration: workout.duration,
      calories: workout.calories,
      notes: workout.notes || '',
      date: workout.date
    });
    setShowAddWorkout(true);
  };

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        setWorkouts(prev => prev.filter(w => w.id !== workoutId));
        toast.success('Workout deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete workout');
      }
    }
  };

  const getWorkoutStats = () => {
    const thisWeek = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate >= weekAgo;
    });

    const totalCalories = thisWeek.reduce((sum, w) => sum + w.calories, 0);
    const totalDuration = thisWeek.reduce((sum, w) => sum + w.duration, 0);
    const workoutCount = thisWeek.length;

    return {
      totalCalories,
      totalDuration,
      workoutCount,
      averageDuration: workoutCount > 0 ? Math.round(totalDuration / workoutCount) : 0
    };
  };

  const getTypeIcon = (type) => {
    const workoutType = workoutTypes.find(t => t.value === type);
    return workoutType ? workoutType.icon : Activity;
  };

  const getTypeColor = (type) => {
    const workoutType = workoutTypes.find(t => t.value === type);
    return workoutType ? workoutType.color : 'text-gray-500';
  };

  const stats = getWorkoutStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart className="mr-3 text-red-500" size={32} />
            Workout Tracker
          </h1>
          <p className="text-gray-600 mt-1">Fitness and exercise tracking</p>
        </div>
        <button
          onClick={() => setShowAddWorkout(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Workout</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">This Week</p>
              <p className="text-2xl font-bold text-blue-700">{stats.workoutCount}</p>
            </div>
            <Activity className="text-blue-500" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Total Calories</p>
              <p className="text-2xl font-bold text-green-700">{stats.totalCalories}</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Total Time</p>
              <p className="text-2xl font-bold text-purple-700">{stats.totalDuration}m</p>
            </div>
            <Clock className="text-purple-500" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Avg Duration</p>
              <p className="text-2xl font-bold text-orange-700">{stats.averageDuration}m</p>
            </div>
            <Target className="text-orange-500" size={24} />
          </div>
        </motion.div>
      </div>

      {/* Workouts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Workouts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {workouts.map((workout) => {
            const TypeIcon = getTypeIcon(workout.type);
            const typeColor = getTypeColor(workout.type);
            return (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeColor.replace('text-', 'bg-')}20`}>
                      <TypeIcon size={24} className={typeColor} />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{workout.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {format(new Date(workout.date), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {workout.duration} min
                        </span>
                        <span className="flex items-center">
                          <Target size={14} className="mr-1" />
                          {workout.calories} cal
                        </span>
                      </div>
                      {workout.notes && (
                        <p className="text-sm text-gray-600 mt-2">{workout.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(workout)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {workouts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center"
        >
          <Heart className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Workouts Yet</h3>
          <p className="text-gray-600 mb-6">Start tracking your fitness journey by adding your first workout.</p>
          <button
            onClick={() => setShowAddWorkout(true)}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Add Your First Workout</span>
          </button>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      {showAddWorkout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddWorkout(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingWorkout ? 'Edit Workout' : 'Add New Workout'}
              </h3>
              <button
                onClick={() => {
                  setShowAddWorkout(false);
                  setEditingWorkout(null);
                  setFormData({
                    name: '',
                    type: 'strength',
                    duration: 30,
                    calories: 0,
                    notes: '',
                    date: format(new Date(), 'yyyy-MM-dd')
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workout Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Morning Strength Training"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {workoutTypes.map((type) => {
                    const TypeIcon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.value })}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.type === type.value
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <TypeIcon size={20} className={`mx-auto mb-1 ${type.color}`} />
                        <span className="text-xs text-gray-700">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories Burned
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="How did the workout feel? Any notes..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddWorkout(false);
                    setEditingWorkout(null);
                    setFormData({
                      name: '',
                      type: 'strength',
                      duration: 30,
                      calories: 0,
                      notes: '',
                      date: format(new Date(), 'yyyy-MM-dd')
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{editingWorkout ? 'Update' : 'Add'} Workout</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Workouts;

