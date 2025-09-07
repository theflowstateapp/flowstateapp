import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import CaptureConfirmSheet from './CaptureConfirmSheet.js';

const CaptureBox = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCapture = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ text: input })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.draft) {
          setDraft(result.draft);
          setShowConfirm(true);
          setInput('');
        }
      } else {
        console.error('Capture failed');
      }
    } catch (error) {
      console.error('Error capturing task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCapture();
    }
  };

  const handleAccept = (task) => {
    console.log('Task accepted:', task);
    setShowConfirm(false);
    setDraft(null);
    // Show success toast
    if (window.showToast) {
      window.showToast('Scheduled', 'success');
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setDraft(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="space-y-3">
          <div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type any task. We'll auto-sort with PARA and suggest a time block."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Press Cmd+Enter to capture
            </div>
            <button
              onClick={handleCapture}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Capture</span>
            </button>
          </div>
        </div>
      </div>

      {showConfirm && draft && (
        <CaptureConfirmSheet
          draft={draft}
          onClose={handleCancel}
          onAccept={handleAccept}
        />
      )}
    </>
  );
};

export default CaptureBox;