import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Calendar, X, Plus } from 'lucide-react';

const NextSuggestedCard = ({ onCaptureOpen }) => {
  const [suggestedTask, setSuggestedTask] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isReshuffling, setIsReshuffling] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [excludeList, setExcludeList] = useState([]);

  useEffect(() => {
    loadNextSuggestedTask();
  }, []);

  const loadNextSuggestedTask = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks/next-suggested', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.task) {
          setSuggestedTask(result.task);
          await loadFirstProposal(result.task);
        }
      }
    } catch (error) {
      console.error('Error loading next suggested task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFirstProposal = async (task) => {
    try {
      const response = await fetch('/api/schedule/propose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          estimateMins: task.estimateMins || 30,
          priority: task.priority,
          context: task.context
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.proposals && result.proposals.length > 0) {
          setProposal(result.proposals[0]);
          setExcludeList([{ start: result.proposals[0].start, end: result.proposals[0].end }]);
        }
      }
    } catch (error) {
      console.error('Error loading proposal:', error);
    }
  };

  const handleAccept = async () => {
    if (!suggestedTask || !proposal) return;

    setIsScheduling(true);
    try {
      const response = await fetch('/api/tasks/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          id: suggestedTask.id,
          startAt: proposal.start,
          endAt: proposal.end
        })
      });

      if (response.ok) {
        if (window.showToast) {
          window.showToast('Scheduled', 'success');
        }
        
        // Log telemetry event
        console.log('TELEMETRY: next_suggested_accept', {
          taskId: suggestedTask.id,
          startAt: proposal.start,
          endAt: proposal.end
        });
        
        // Reload to get next suggested task
        loadNextSuggestedTask();
      } else {
        console.error('Failed to schedule task');
      }
    } catch (error) {
      console.error('Error scheduling task:', error);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleReshuffle = async () => {
    if (!suggestedTask) return;

    setIsReshuffling(true);
    try {
      const response = await fetch('/api/schedule/propose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          estimateMins: suggestedTask.estimateMins || 30,
          priority: suggestedTask.priority,
          context: suggestedTask.context,
          exclude: excludeList
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.proposals && result.proposals.length > 0) {
          const newProposal = result.proposals[0];
          setProposal(newProposal);
          setExcludeList([...excludeList, { start: newProposal.start, end: newProposal.end }]);
          
          // Log telemetry event
          console.log('TELEMETRY: next_suggested_reshuffle', {
            taskId: suggestedTask.id,
            attemptIndex: excludeList.length
          });
        } else {
          if (window.showToast) {
            window.showToast('No other good slots this week—try a shorter estimate.', 'info');
          }
        }
      }
    } catch (error) {
      console.error('Error reshuffling:', error);
    } finally {
      setIsReshuffling(false);
    }
  };

  const handleSkip = () => {
    if (!suggestedTask) return;
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`ns_skip_${suggestedTask.id}_${today}`, '1');
    setIsSkipped(true);
    
    // Log telemetry event
    console.log('TELEMETRY: next_suggested_skip', {
      taskId: suggestedTask.id
    });
    
    // Reload to get next suggested task
    setTimeout(() => {
      loadNextSuggestedTask();
    }, 1000);
  };

  const formatProposalTime = (startStr) => {
    const date = new Date(startStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      case 'LOW':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-400 animate-pulse" />
          <span className="text-gray-500">Finding your next suggested task...</span>
        </div>
      </div>
    );
  }

  if (!suggestedTask) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="text-center space-y-4">
          <div className="text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No suggested tasks right now</p>
          </div>
          <button
            onClick={onCaptureOpen}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Open Capture</span>
          </button>
        </div>
      </div>
    );
  }

  if (isSkipped) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="text-center text-gray-500">
          <X className="w-6 h-6 mx-auto mb-2 text-gray-300" />
          <p>Task skipped for today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Next suggested task</h3>
            <p className="text-sm text-gray-600">We found a focused slot within your work hours.</p>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Skip suggestion"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-800">{suggestedTask.title}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestedTask.priority)}`}>
                {suggestedTask.priority}
              </span>
              {suggestedTask.context && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {suggestedTask.context}
                </span>
              )}
              {(suggestedTask.projectName || suggestedTask.areaName) && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                  {suggestedTask.projectName || suggestedTask.areaName}
                </span>
              )}
            </div>
          </div>

          {proposal ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="space-y-2">
                <div>
                  <h5 className="font-medium text-green-800">Proposed</h5>
                  <p className="text-green-700 text-sm">
                    {formatProposalTime(proposal.start)} • {proposal.rationale}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAccept}
                    disabled={isScheduling}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-1 text-sm"
                    aria-label="Accept proposed time block"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={handleReshuffle}
                    disabled={isReshuffling}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center space-x-1 text-sm"
                    aria-label="Reshuffle proposal"
                  >
                    <RefreshCw className={`w-3 h-3 ${isReshuffling ? 'animate-spin' : ''}`} />
                    <span>Reshuffle</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">No good slot—open Capture</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextSuggestedCard;