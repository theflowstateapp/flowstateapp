import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Utensils,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Activity,
  Apple,
  Coffee,
  Pizza,
  Salad,
  Fish,
  Beef,
  Save,
  X,
  Loader,
  CheckCircle,
  Circle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Meals = () => {
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'breakfast',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    notes: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm')
  });
  const { user } = useAuth();

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'text-orange-500' },
    { value: 'lunch', label: 'Lunch', icon: Pizza, color: 'text-yellow-500' },
    { value: 'dinner', label: 'Dinner', icon: Utensils, color: 'text-purple-500' },
    { value: 'snack', label: 'Snack', icon: Apple, color: 'text-green-500' },
    { value: 'salad', label: 'Salad', icon: Salad, color: 'text-emerald-500' },
    { value: 'protein', label: 'Protein', icon: Beef, color: 'text-red-500' }
  ];

  // Sample meal data (in real app, this would come from database)
  const [meals, setMeals] = useState([
    {
      id: 1,
      name: 'Oatmeal with Berries',
      type: 'breakfast',
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 8,
      notes: 'Added honey and almonds',
      date: '2024-01-15',
      time: '08:00',
      created_at: '2024-01-15T08:00:00Z'
    },
    {
      id: 2,
      name: 'Grilled Chicken Salad',
      type: 'lunch',
      calories: 450,
      protein: 35,
      carbs: 15,
      fat: 25,
      notes: 'Mixed greens with vinaigrette',
      date: '2024-01-15',
      time: '12:30',
      created_at: '2024-01-15T12:30:00Z'
    },
    {
      id: 3,
      name: 'Salmon with Vegetables',
      type: 'dinner',
      calories: 580,
      protein: 42,
      carbs: 20,
      fat: 32,
      notes: 'Steamed broccoli and quinoa',
      date: '2024-01-14',
      time: '19:00',
      created_at: '2024-01-14T19:00:00Z'
    }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a meal name');
      return;
    }

    try {
      if (editingMeal) {
        const updatedMeals = meals.map(m => 
          m.id === editingMeal.id ? { ...m, ...formData } : m
        );
        setMeals(updatedMeals);
        toast.success('Meal updated successfully!');
      } else {
        const newMeal = {
          id: Date.now(),
          ...formData,
          created_at: new Date().toISOString()
        };
        setMeals(prev => [newMeal, ...prev]);
        toast.success('Meal added successfully!');
      }
      setShowAddMeal(false);
      setEditingMeal(null);
      setFormData({
        name: '',
        type: 'breakfast',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        notes: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm')
      });
    } catch (error) {
      toast.error('Failed to save meal');
    }
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      type: meal.type,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      notes: meal.notes || '',
      date: meal.date,
      time: meal.time
    });
    setShowAddMeal(true);
  };

  const handleDelete = async (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        setMeals(prev => prev.filter(m => m.id !== mealId));
        toast.success('Meal deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete meal');
      }
    }
  };

  const getMealStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayMeals = meals.filter(m => m.date === today);

    const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = todayMeals.reduce((sum, m) => sum + m.protein, 0);
    const totalCarbs = todayMeals.reduce((sum, m) => sum + m.carbs, 0);
    const totalFat = todayMeals.reduce((sum, m) => sum + m.fat, 0);

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      mealCount: todayMeals.length
    };
  };

  const getTypeIcon = (type) => {
    const mealType = mealTypes.find(t => t.value === type);
    return mealType ? mealType.icon : Utensils;
  };

  const getTypeColor = (type) => {
    const mealType = mealTypes.find(t => t.value === type);
    return mealType ? mealType.color : 'text-gray-500';
  };

  const stats = getMealStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Utensils className="mr-3 text-orange-500" size={32} />
            Meal Tracker
          </h1>
          <p className="text-gray-600 mt-1">Track your nutrition and meals</p>
        </div>
        <button
          onClick={() => setShowAddMeal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Meal</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Today's Meals</p>
              <p className="text-2xl font-bold text-orange-700">{stats.mealCount}</p>
            </div>
            <Utensils className="text-orange-500" size={24} />
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
              <p className="text-sm text-red-600">Calories</p>
              <p className="text-2xl font-bold text-red-700">{stats.totalCalories}</p>
            </div>
            <Target className="text-red-500" size={24} />
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
              <p className="text-sm text-blue-600">Protein (g)</p>
              <p className="text-2xl font-bold text-blue-700">{stats.totalProtein}</p>
            </div>
            <TrendingUp className="text-blue-500" size={24} />
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
              <p className="text-sm text-green-600">Carbs (g)</p>
              <p className="text-2xl font-bold text-green-700">{stats.totalCarbs}</p>
            </div>
            <Activity className="text-green-500" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Fat (g)</p>
              <p className="text-2xl font-bold text-purple-700">{stats.totalFat}</p>
            </div>
            <Circle className="text-purple-500" size={24} />
          </div>
        </motion.div>
      </div>

      {/* Meals List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Meals</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {meals.map((meal) => {
            const TypeIcon = getTypeIcon(meal.type);
            const typeColor = getTypeColor(meal.type);
            return (
              <motion.div
                key={meal.id}
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
                      <h4 className="text-lg font-medium text-gray-900">{meal.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {format(new Date(meal.date), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {meal.time}
                        </span>
                        <span className="flex items-center">
                          <Target size={14} className="mr-1" />
                          {meal.calories} cal
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 mt-2">
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                      {meal.notes && (
                        <p className="text-sm text-gray-600 mt-2">{meal.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(meal)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(meal.id)}
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
      {meals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center"
        >
          <Utensils className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Meals Yet</h3>
          <p className="text-gray-600 mb-6">Start tracking your nutrition by adding your first meal.</p>
          <button
            onClick={() => setShowAddMeal(true)}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Add Your First Meal</span>
          </button>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      {showAddMeal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddMeal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingMeal ? 'Edit Meal' : 'Add New Meal'}
              </h3>
              <button
                onClick={() => {
                  setShowAddMeal(false);
                  setEditingMeal(null);
                  setFormData({
                    name: '',
                    type: 'breakfast',
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0,
                    notes: '',
                    date: format(new Date(), 'yyyy-MM-dd'),
                    time: format(new Date(), 'HH:mm')
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
                  Meal Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Grilled Chicken Salad"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {mealTypes.map((type) => {
                    const TypeIcon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.value })}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.type === type.value
                            ? 'border-orange-500 bg-orange-50'
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
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    value={formData.fat}
                    onChange={(e) => setFormData({ ...formData, fat: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Any notes about this meal..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMeal(false);
                    setEditingMeal(null);
                    setFormData({
                      name: '',
                      type: 'breakfast',
                      calories: 0,
                      protein: 0,
                      carbs: 0,
                      fat: 0,
                      notes: '',
                      date: format(new Date(), 'yyyy-MM-dd'),
                      time: format(new Date(), 'HH:mm')
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
                  <span>{editingMeal ? 'Update' : 'Add'} Meal</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Meals;

