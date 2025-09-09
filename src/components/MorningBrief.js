import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  X, 
  Play, 
  RefreshCw, 
  ChevronDown,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

const MorningBrief = ({ onStartFocus, onDismiss }) => {
  const [briefData, setBriefData] = useState(null);
  const [acceptedItems, setAcceptedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [committing, setCommitting] = useState(false);
  const [startingFocus, setStartingFocus] = useState(false);
  const [reshuffling, setReshuffling] = useState(false);
  const [strategy, setStrategy] = useState('mornings');
  const [showStrategyDropdown, setShowStrategyDropdown] = useState(false);

  // Check if we should show the brief (07:30-11:00 IST)
  const shouldShowBrief = () => {
    const now = new Date();
    const istHour = now.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata', 
      hour: '2-digit', 
      hour12: false 
    });
    const hour = parseInt(istHour);
    return hour >= 7 && hour <= 11;
  };

  // Check if user has dismissed today
  const isDismissedToday = () => {
    const today = new Date().toDateString();
    const dismissed = localStorage.getItem('morningBriefDismissed');
    return dismissed === today;
  };

  // Load morning brief data
  const loadBriefData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/brief/today');
      const data = await response.json();
      setBriefData(data);
    } catch (error) {
      console.error('Failed to load morning brief:', error);
    } finally {
      setLoading(false);
    }
  };

  // Commit accepted items
  const commitAcceptedItems = async () => {
    if (acceptedItems.size === 0) return;

    try {
      setCommitting(true);
      const itemsToCommit = briefData.items
        .filter(item => acceptedItems.has(item.taskId))
        .map(item => ({
          taskId: item.taskId,
          accept: true,
          proposal: item.proposal
        }));

      const response = await fetch('/api/brief/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToCommit })
      });

      const result = await response.json();
      console.log('Committed items:', result.committed);
      
      // Clear accepted items
      setAcceptedItems(new Set());
      
      // Reload brief data to reflect changes
      await loadBriefData();
    } catch (error) {
      console.error('Failed to commit items:', error);
    } finally {
      setCommitting(false);
    }
  };

  // Start focus session
  const startFocusSession = async () => {
    const firstAccepted = briefData.items.find(item => acceptedItems.has(item.taskId));
    const firstItem = briefData.items[0];

    try {
      setStartingFocus(true);
      
      if (firstAccepted) {
        // Commit first accepted item and start focus
        const itemsToCommit = [{
          taskId: firstAccepted.taskId,
          accept: true,
          proposal: firstAccepted.proposal
        }];

        const commitResponse = await fetch('/api/brief/commit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            items: itemsToCommit, 
            startFirstFocus: true 
          })
        });

        const commitResult = await commitResponse.json();
        
        if (commitResult.startedSessionId) {
          onStartFocus(commitResult.startedSessionId);
        }
      } else if (firstItem && firstItem.proposal) {
        // Start focus without committing
        const focusResponse = await fetch('/api/focus/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: firstItem.taskId,
            plannedMinutes: firstItem.estimateMins || 25,
            intention: 'Morning brief'
          })
        });

        const focusResult = await focusResponse.json();
        if (focusResult.sessionId) {
          onStartFocus(focusResult.sessionId);
        }
      }
    } catch (error) {
      console.error('Failed to start focus:', error);
    } finally {
      setStartingFocus(false);
    }
  };

  // Reshuffle proposals
  const reshuffleProposals = async () => {
    try {
      setReshuffling(true);
      const response = await fetch('/api/brief/reshuffle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy })
      });

      const data = await response.json();
      setBriefData(data);
      setAcceptedItems(new Set()); // Clear accepted items
    } catch (error) {
      console.error('Failed to reshuffle:', error);
    } finally {
      setReshuffling(false);
    }
  };

  // Dismiss brief for today
  const dismissBrief = () => {
    const today = new Date().toDateString();
    localStorage.setItem('morningBriefDismissed', today);
    onDismiss();
  };

  // Format time for display
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Format priority for display
  const formatPriority = (priority) => {
    if (!priority) return 'Low';
    if (priority.includes('High')) return 'High';
    if (priority.includes('Medium')) return 'Medium';
    return 'Low';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!briefData) return;
      
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          // Toggle first item acceptance
          const firstItem = briefData.items[0];
          if (firstItem) {
            const newAccepted = new Set(acceptedItems);
            if (newAccepted.has(firstItem.taskId)) {
              newAccepted.delete(firstItem.taskId);
            } else {
              newAccepted.add(firstItem.taskId);
            }
            setAcceptedItems(newAccepted);
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          reshuffleProposals();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          startFocusSession();
          break;
        case 'Escape':
          e.preventDefault();
          dismissBrief();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [briefData, acceptedItems]);

  // Load data on mount
  useEffect(() => {
    if (shouldShowBrief() && !isDismissedToday()) {
      loadBriefData();
    }
  }, []);

  // Don't show if conditions aren't met
  if (!shouldShowBrief() || isDismissedToday()) {
    return null;
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading morning brief...</span>
        </div>
      </motion.div>
    );
  }

  if (!briefData || !briefData.items || briefData.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Morning Brief</h3>
            <p className="text-sm text-gray-600">No clear picks yet. Open Tasks to choose your top 3.</p>
          </div>
          <button
            onClick={dismissBrief}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => window.location.href = '/tasks'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Tasks
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Morning Brief</h3>
          <p className="text-sm text-gray-600">Review today's top 3 and start strong.</p>
        </div>
        <button
          onClick={dismissBrief}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3 mb-6">
        {briefData.items.map((item, index) => (
          <motion.div
            key={item.taskId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border transition-all ${
              acceptedItems.has(item.taskId)
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    formatPriority(item.priority) === 'High' 
                      ? 'bg-red-100 text-red-700'
                      : formatPriority(item.priority) === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {formatPriority(item.priority)}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {item.estimateMins}m
                  </span>
                  {item.dueAt && (
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                      Due {new Date(item.dueAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {item.proposal ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(item.proposal.startAt)}–{formatTime(item.proposal.endAt)} IST
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No slot yet</div>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => {
                    const newAccepted = new Set(acceptedItems);
                    if (newAccepted.has(item.taskId)) {
                      newAccepted.delete(item.taskId);
                    } else {
                      newAccepted.add(item.taskId);
                    }
                    setAcceptedItems(newAccepted);
                  }}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    acceptedItems.has(item.taskId)
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {acceptedItems.has(item.taskId) ? (
                    <>
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Accepted
                    </>
                  ) : (
                    'Accept'
                  )}
                </button>
                <button
                  onClick={() => {
                    const newAccepted = new Set(acceptedItems);
                    newAccepted.delete(item.taskId);
                    setAcceptedItems(newAccepted);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={startFocusSession}
            disabled={startingFocus}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {startingFocus ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>Start Focus</span>
          </button>
          
          <button
            onClick={commitAcceptedItems}
            disabled={committing || acceptedItems.size === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {committing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <span>Accept schedule</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowStrategyDropdown(!showStrategyDropdown)}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reshuffle</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <AnimatePresence>
              {showStrategyDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setStrategy('mornings');
                        setShowStrategyDropdown(false);
                        reshuffleProposals();
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        strategy === 'mornings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      Mornings (09:30-12:30)
                    </button>
                    <button
                      onClick={() => {
                        setStrategy('balanced');
                        setShowStrategyDropdown(false);
                        reshuffleProposals();
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        strategy === 'balanced' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      Balanced (09:00-17:00)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button
            onClick={dismissBrief}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <span className="font-medium">Shortcuts:</span> Enter (toggle), R (reshuffle), S (start focus), Esc (dismiss)
        </div>
      </div>
    </motion.div>
  );
};

export default MorningBrief;
