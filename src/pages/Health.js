import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Activity,
  Droplets,
  Moon,
  Target,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const Health = () => {
  const [healthData, setHealthData] = useState({
    weight: 70,
    sleepHours: 7.5,
    waterIntake: 6.5,
    steps: 8500,
    heartRate: 72,
    calories: 2100,
    workouts: [
      { id: 1, type: 'Cardio', duration: 45, calories: 350, date: '2024-05-07' },
      { id: 2, type: 'Strength', duration: 60, calories: 280, date: '2024-05-05' },
      { id: 3, type: 'Yoga', duration: 30, calories: 150, date: '2024-05-03' }
    ],
    measurements: [
      { id: 1, type: 'Weight', value: 70, unit: 'kg', date: '2024-05-07' },
      { id: 2, type: 'Weight', value: 70.5, unit: 'kg', date: '2024-05-01' },
      { id: 3, type: 'Weight', value: 71, unit: 'kg', date: '2024-04-24' }
    ]
  });

  const [showLogExercise, setShowLogExercise] = useState(false);
  const [showLogWater, setShowLogWater] = useState(false);
  const [showLogSleep, setShowLogSleep] = useState(false);
  const [showWeighIn, setShowWeighIn] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleLogExercise = (data) => {
    const newWorkout = {
      id: Date.now(),
      type: 'Exercise',
      duration: 30,
      calories: data.calories,
      date: new Date().toISOString().split('T')[0]
    };
    setHealthData(prev => ({
      ...prev,
      workouts: [newWorkout, ...prev.workouts],
      calories: prev.calories + data.calories
    }));
    setShowLogExercise(false);
    toast.success('Exercise logged successfully!');
  };

  const handleLogWater = (amount) => {
    setHealthData(prev => ({
      ...prev,
      waterIntake: Math.min(prev.waterIntake + amount, 10)
    }));
    setShowLogWater(false);
    toast.success(`${amount}L of water logged!`);
  };

  const handleLogSleep = (hours) => {
    setHealthData(prev => ({
      ...prev,
      sleepHours: hours
    }));
    setShowLogSleep(false);
    toast.success(`${hours} hours of sleep logged!`);
  };

  const handleWeighIn = (weight) => {
    const newMeasurement = {
      id: Date.now(),
      type: 'Weight',
      value: weight,
      unit: 'kg',
      date: new Date().toISOString().split('T')[0]
    };
    setHealthData(prev => ({
      ...prev,
      weight,
      measurements: [newMeasurement, ...prev.measurements]
    }));
    setShowWeighIn(false);
    toast.success('Weight logged successfully!');
  };

  const getHealthScore = () => {
    const scores = {
      weight: healthData.weight >= 60 && healthData.weight <= 80 ? 100 : 70,
      sleep: healthData.sleepHours >= 7 && healthData.sleepHours <= 9 ? 100 : 60,
      water: healthData.waterIntake >= 8 ? 100 : Math.round((healthData.waterIntake / 8) * 100),
      steps: healthData.steps >= 10000 ? 100 : Math.round((healthData.steps / 10000) * 100),
      heartRate: healthData.heartRate >= 60 && healthData.heartRate <= 100 ? 100 : 80
    };
    return Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);
  };

  const MetricCard = ({ title, value, unit, target, icon: Icon, color, change, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {change && (
          <div className="flex items-center space-x-1">
            {change >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-success-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-danger-600" />
            )}
            <span className={`text-sm font-medium ${change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {value}{unit}
        </p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {target && (
        <div className="flex items-center justify-between">
          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
            <div 
              className={`h-2 rounded-full ${color}`}
              style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-500">Target: {target}{unit}</span>
        </div>
      )}
    </motion.div>
  );

  const filteredWorkouts = healthData.workouts.filter(workout => {
    if (filter === 'all') return true;
    if (filter === 'cardio') return workout.type.toLowerCase().includes('cardio');
    if (filter === 'strength') return workout.type.toLowerCase().includes('strength');
    if (filter === 'yoga') return workout.type.toLowerCase().includes('yoga');
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health & Wellness</h1>
          <p className="text-gray-600 mt-1">Track your health metrics and wellness goals</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowLogExercise(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Log Exercise</span>
          </button>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Weight"
          value={healthData.weight}
          unit=" kg"
          target={75}
          icon={Target}
          color="bg-primary-500"
          change={-2.5}
          subtitle="Target: 75kg"
        />
        <MetricCard
          title="Sleep"
          value={healthData.sleepHours}
          unit="h"
          target={8}
          icon={Moon}
          color="bg-secondary-500"
          subtitle="Target: 8h"
        />
        <MetricCard
          title="Water Intake"
          value={healthData.waterIntake}
          unit="L"
          target={8}
          icon={Droplets}
          color="bg-danger-500"
          subtitle="Target: 8L"
        />
        <MetricCard
          title="Steps Today"
          value={healthData.steps.toLocaleString()}
          unit=""
          target={10000}
          icon={Activity}
          color="bg-success-500"
          subtitle="Target: 10,000"
        />
        <MetricCard
          title="Heart Rate"
          value={healthData.heartRate}
          unit=" bpm"
          icon={Heart}
          color="bg-danger-500"
          subtitle="Normal range: 60-100"
        />
        <MetricCard
          title="Calories Burned"
          value={healthData.calories.toLocaleString()}
          unit=""
          target={2500}
          icon={TrendingUp}
          color="bg-warning-500"
          subtitle="Target: 2,500"
        />
      </div>

      {/* Health Score */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Score</h2>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gradient-to-br from-success-400 to-success-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{getHealthScore()}%</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 mb-2">Overall health score based on your metrics</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Weight Management</span>
                <span className="text-sm font-medium text-gray-900">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sleep Quality</span>
                <span className="text-sm font-medium text-gray-900">90%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hydration</span>
                <span className="text-sm font-medium text-gray-900">75%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowLogExercise(true)}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="p-3 rounded-lg bg-primary-500 mb-3 group-hover:scale-110 transition-transform duration-200">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Log Exercise</span>
          </button>
          <button
            onClick={() => setShowLogWater(true)}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="p-3 rounded-lg bg-danger-500 mb-3 group-hover:scale-110 transition-transform duration-200">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Add Water</span>
          </button>
          <button
            onClick={() => setShowLogSleep(true)}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="p-3 rounded-lg bg-secondary-500 mb-3 group-hover:scale-110 transition-transform duration-200">
              <Moon className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Log Sleep</span>
          </button>
          <button
            onClick={() => setShowWeighIn(true)}
            className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="p-3 rounded-lg bg-warning-500 mb-3 group-hover:scale-110 transition-transform duration-200">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Weigh In</span>
          </button>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Workouts</h2>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Workouts</option>
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
              <option value="yoga">Yoga</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {filteredWorkouts.map((workout) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Activity className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{workout.type}</h3>
                  <p className="text-sm text-gray-500">{workout.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{workout.duration} min</span>
                <span>{workout.calories} cal</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Log Exercise Modal */}
      {showLogExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Exercise</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleLogExercise({
                calories: parseInt(formData.get('calories')),
                steps: parseInt(formData.get('steps'))
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
                  <input
                    name="calories"
                    type="number"
                    required
                    className="input-field"
                    placeholder="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
                  <input
                    name="steps"
                    type="number"
                    required
                    className="input-field"
                    placeholder="5000"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  Log Exercise
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogExercise(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Water Modal */}
      {showLogWater && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Water Intake</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[0.5, 1, 1.5, 2, 2.5, 3].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleLogWater(amount)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    {amount}L
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowLogWater(false)}
                className="btn-secondary w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Sleep Modal */}
      {showLogSleep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Sleep</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[6, 7, 8, 9, 10].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => handleLogSleep(hours)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    {hours}h
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowLogSleep(false)}
                className="btn-secondary w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weigh In Modal */}
      {showWeighIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weigh In</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleWeighIn(parseFloat(formData.get('weight')));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    step="0.1"
                    required
                    className="input-field"
                    placeholder="70.5"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  Log Weight
                </button>
                <button
                  type="button"
                  onClick={() => setShowWeighIn(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Health;
