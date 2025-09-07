import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Calendar, X, Plus } from 'lucide-react';
import { ProposedBlock } from '../../types/capture';

interface NextSuggestedCardProps {
  onCaptureOpen?: () => void;
}

interface SuggestedTask {
  id: string;
  title: string;
  priority: string;
  context?: string;
  estimateMins?: number;
}

const NextSuggestedCard: React.FC<NextSuggestedCardProps> = ({ onCaptureOpen }) => {
  const [suggestedTask, setSuggestedTask] = useState<SuggestedTask | null>(null);
  const [proposals, setProposals] = useState<ProposedBlock[]>([]);
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isReshuffling, setIsReshuffling] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    loadNextSuggestedTask();
  }, []);

  const loadNextSuggestedTask = async () => {
    setIsLoading(true);
    try {
      // Get highest priority non-DONE task without startAt
      const response = await fetch('/api/tasks/next-suggested', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.task) {
          setSuggestedTask(result.task);
          await loadProposals(result.task);
        }
      }
    } catch (error) {
      console.error('Error loading next suggested task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProposals = async (task: SuggestedTask) => {
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
        setProposals(result.proposals || []);
      }
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  };

  const handleAccept = async () => {
    if (!suggestedTask || proposals.length === 0) return;

    setIsScheduling(true);
    try {
      const currentProposal = proposals[currentProposalIndex];
      
      const response = await fetch('/api/tasks/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          id: suggestedTask.id,
          startAt: currentProposal.start,
          endAt: currentProposal.end
        })
      });

      if (response.ok) {
        if (window.showToast) {
          window.showToast('Scheduled', 'success');
        }
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
      const exclude = proposals.slice(0, currentProposalIndex + 1).map(p => ({
        start: p.start,
        end: p.end
      }));

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
          exclude
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.proposals && result.proposals.length > 0) {
          setProposals([...proposals, ...result.proposals]);
          setCurrentProposalIndex(proposals.length);
        } else {
          if (window.showToast) {
            window.showToast('No more suggestions—try Reshuffle later or adjust estimate.', 'info');
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
    localStorage.setItem(`ns_skip_${suggestedTask.id}_${today}`, 'true');
    setIsSkipped(true);
    
    // Reload to get next suggested task
    setTimeout(() => {
      loadNextSuggestedTask();
    }, 1000);
  };

  const currentProposal = proposals[currentProposalIndex];

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
            <span>Capture a new task</span>
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
          <h3 className="text-lg font-medium text-gray-900">Next Suggested Task</h3>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-800">{suggestedTask.title}</h4>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              suggestedTask.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
              suggestedTask.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
              suggestedTask.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {suggestedTask.priority}
            </span>
            {suggestedTask.context && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {suggestedTask.context}
              </span>
            )}
            {suggestedTask.estimateMins && (
              <span className="text-sm text-gray-500">
                {suggestedTask.estimateMins}m
              </span>
            )}
          </div>
        </div>

        {currentProposal && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="space-y-2">
              <div>
                <h5 className="font-medium text-green-800">Proposed Time Block</h5>
                <p className="text-green-700 text-sm">{currentProposal.rationale}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAccept}
                  disabled={isScheduling}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-1 text-sm"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Accept</span>
                </button>
                <button
                  onClick={handleReshuffle}
                  disabled={isReshuffling}
                  className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center space-x-1 text-sm"
                >
                  <RefreshCw className={`w-3 h-3 ${isReshuffling ? 'animate-spin' : ''}`} />
                  <span>Reshuffle</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {proposals.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">No available time slots. Try adjusting estimate or priority.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextSuggestedCard;
