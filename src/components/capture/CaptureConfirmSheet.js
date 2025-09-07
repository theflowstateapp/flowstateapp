import React, { useState, useEffect } from 'react';
import { X, Clock, RefreshCw, Save, Calendar, AlertTriangle } from 'lucide-react';

const CaptureConfirmSheet = ({ draft, onClose, onAccept }) => {
  const [proposals, setProposals] = useState([]);
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0);
  const [isLoadingProposals, setIsLoadingProposals] = useState(true);
  const [isReshuffling, setIsReshuffling] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: draft.title || '',
    description: draft.description || '',
    paraBucket: draft.paraBucket || 'INBOX',
    priority: draft.priority || 'MEDIUM',
    dueAt: draft.due || '',
    estimateMins: draft.estimateMins || 30,
    context: draft.context || '',
    tags: (draft.tags || []).join(', ')
  });

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    setIsLoadingProposals(true);
    try {
      const response = await fetch('/api/schedule/propose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          estimateMins: formData.estimateMins,
          priority: formData.priority,
          context: formData.context
        })
      });

      if (response.ok) {
        const result = await response.json();
        setProposals(result.proposals || []);
      }
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setIsLoadingProposals(false);
    }
  };

  const handleReshuffle = async () => {
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
          estimateMins: formData.estimateMins,
          priority: formData.priority,
          context: formData.context,
          exclude
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.proposals && result.proposals.length > 0) {
          setProposals([...proposals, ...result.proposals]);
          setCurrentProposalIndex(proposals.length);
        } else {
          // No more proposals available
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

  const handleAccept = async () => {
    if (proposals.length === 0) return;

    setIsCreating(true);
    try {
      const currentProposal = proposals[currentProposalIndex];
      
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
          startAt: currentProposal.start,
          endAt: currentProposal.end
        })
      });

      if (response.ok) {
        const result = await response.json();
        onAccept?.(result.task);
        if (window.showToast) {
          window.showToast('Scheduled', 'success');
        }
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveWithoutScheduling = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
        })
      });

      if (response.ok) {
        const result = await response.json();
        onAccept?.(result.task);
        if (window.showToast) {
          window.showToast('Saved without schedule', 'success');
        }
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const currentProposal = proposals[currentProposalIndex];
  const hasLowConfidence = draft.confidence && draft.confidence < 0.7;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Review & schedule</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Low confidence warning */}
          {hasLowConfidence && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-800 text-sm">Some fields may need a check.</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Editable fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PARA Bucket</label>
                <div className="flex space-x-2">
                  {['PROJECT', 'AREA', 'RESOURCE', 'INBOX'].map((bucket) => (
                    <button
                      key={bucket}
                      onClick={() => setFormData({ ...formData, paraBucket: bucket })}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        formData.paraBucket === bucket
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {bucket}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimate (minutes)</label>
                  <input
                    type="number"
                    value={formData.estimateMins}
                    onChange={(e) => setFormData({ ...formData, estimateMins: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueAt}
                    onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Context</label>
                  <select
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select context</option>
                    <option value="Deep Work">Deep Work</option>
                    <option value="Admin">Admin</option>
                    <option value="Errand">Errand</option>
                    <option value="Call">Call</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="comma-separated tags"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right: Proposed time block */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Proposed time block</h3>
              
              {isLoadingProposals ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
                    <span className="text-blue-800">Finding the best time slot...</span>
                  </div>
                </div>
              ) : currentProposal ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-green-800">Suggested Time Block</h4>
                      <p className="text-green-700">{currentProposal.rationale}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAccept}
                        disabled={isCreating}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Accept & Save</span>
                      </button>
                      <button
                        onClick={handleReshuffle}
                        disabled={isReshuffling}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <RefreshCw className={`w-4 h-4 ${isReshuffling ? 'animate-spin' : ''}`} />
                        <span>Reshuffle</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800">No available time slots found. Try adjusting your estimate or priority.</p>
                </div>
              )}

              <div className="text-sm text-gray-500">
                {proposals.length > 0 && (
                  <span>Showing {currentProposalIndex + 1} of {proposals.length} suggestions</span>
                )}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleSaveWithoutScheduling}
              disabled={isCreating}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save without scheduling</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptureConfirmSheet;