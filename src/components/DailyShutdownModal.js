import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, Clock, Target, ArrowRight, Calendar } from 'lucide-react';

const DailyShutdownModal = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [candidateTasks, setCandidateTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [strategy, setStrategy] = useState('balanced');
  const [planResult, setPlanResult] = useState(null);
  
  // Step 1: Review data
  const [highlights, setHighlights] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [mood, setMood] = useState('');

  // Load initial data
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await fetch('/api/day/summary');
        if (response.ok) {
          const data = await response.json();
          setSummary(data.today);
          setCandidateTasks(data.candidateTasks);
        }
      } catch (error) {
        console.error('Failed to load summary:', error);
      }
    };

    loadSummary();
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  const handleStep1Submit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/day/shutdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          highlights: highlights.trim(),
          gratitude: gratitude.trim(),
          mood: mood.trim()
        })
      });

      if (response.ok) {
        setStep(2);
      } else {
        const error = await response.json();
        alert(`Failed to save review: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to save review:', error);
      alert('Failed to save review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    if (selectedTasks.length === 0) {
      alert('Please select at least 1 task for tomorrow.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/day/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskIds: selectedTasks,
          strategy: strategy
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPlanResult(data);
        setStep(3);
      } else {
        const error = await response.json();
        alert(`Failed to create plan: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to create plan:', error);
      alert('Failed to create plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else if (prev.length < 3) {
        return [...prev, taskId];
      }
      return prev;
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Next': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatISTTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatISTDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Daily Shutdown
              </h2>
              <span className="text-sm text-gray-500">Step {step} of 3</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Today at a glance */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Today at a glance</h3>
                
                {summary && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{summary.completedCount}</div>
                      <div className="text-sm text-green-700">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{summary.carryOverCount}</div>
                      <div className="text-sm text-orange-700">Carry-overs</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{summary.flowMinutes}</div>
                      <div className="text-sm text-blue-700">Flow min</div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mood (optional)
                    </label>
                    <div className="flex space-x-2">
                      {['🙂', '😐', '😓'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setMood(emoji)}
                          className={`w-12 h-12 text-2xl rounded-lg border-2 transition-colors ${
                            mood === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      1–2 highlights (optional)
                    </label>
                    <textarea
                      value={highlights}
                      onChange={(e) => setHighlights(e.target.value)}
                      placeholder="What went well today?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      maxLength={250}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {highlights.length}/250 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gratitude (optional)
                    </label>
                    <textarea
                      value={gratitude}
                      onChange={(e) => setGratitude(e.target.value)}
                      placeholder="What are you grateful for today?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      maxLength={250}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {gratitude.length}/250 characters
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleStep1Submit}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save & Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Pick 3 for tomorrow */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pick 3 for tomorrow</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduling strategy
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="mornings"
                        checked={strategy === 'mornings'}
                        onChange={(e) => setStrategy(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Mornings (9:30–12:30)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="balanced"
                        checked={strategy === 'balanced'}
                        onChange={(e) => setStrategy(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Balanced (9:00–17:00)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  {candidateTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskSelection(task.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTasks.includes(task.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-gray-500">
                              {task.estimate_mins}m • {task.context}
                            </span>
                          </div>
                        </div>
                        {selectedTasks.includes(task.id) && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500 mt-3">
                  Selected: {selectedTasks.length}/3 tasks
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleStep2Submit}
                  disabled={loading || selectedTasks.length === 0}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Planning...' : 'Plan Tomorrow'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success screen */}
          {step === 3 && planResult && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  You're set for {formatISTDate(planResult.plan.day)}
                </h3>
                <p className="text-gray-600">
                  Your daily shutdown is complete. Tomorrow's plan is ready!
                </p>
              </div>

              {planResult.planned.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Scheduled tasks</h4>
                  <div className="space-y-2">
                    {planResult.planned.map((task, index) => (
                      <div key={task.taskId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{task.title}</span>
                          <span className="text-sm text-gray-500 ml-2">({task.context})</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatISTTime(task.start)}–{formatISTTime(task.end)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {planResult.unplanned.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Unscheduled tasks</h4>
                  <div className="space-y-2">
                    {planResult.unplanned.map((task) => (
                      <div key={task.taskId} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="font-medium">{task.title}</span>
                        <span className="text-sm text-orange-600">{task.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/agenda')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Calendar className="w-4 h-4 mr-2 inline" />
                  See Agenda
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyShutdownModal;
