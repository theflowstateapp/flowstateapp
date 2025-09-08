import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FocusMode = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sid = searchParams.get('sid');
  
  const [session, setSession] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [interruptionText, setInterruptionText] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [selfRating, setSelfRating] = useState(0);
  const [intention, setIntention] = useState('');
  const [ritual, setRitual] = useState(null);
  
  const intervalRef = useRef(null);
  const interruptionRef = useRef(null);
  const noteRef = useRef(null);
  
  // Load session data
  useEffect(() => {
    if (sid) {
      // For demo purposes, create a mock session
      const mockSession = {
        id: sid,
        task: {
          id: 'task-1',
          title: 'Complete project documentation',
          subtasks: [
            'Write API documentation',
            'Update README',
            'Create user guide'
          ]
        },
        startAt: new Date().toISOString(),
        plannedMinutes: 50,
        targetEnd: new Date(Date.now() + 50 * 60 * 1000).toISOString(),
        intention: 'Finish the API documentation section',
        ritual: {
          tabsClosed: true,
          phoneSilent: true,
          materialsReady: false
        }
      };
      setSession(mockSession);
      setIntention(mockSession.intention || '');
      setRitual(mockSession.ritual);
      setIsRunning(true);
    }
  }, [sid]);
  
  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && !e.target.matches('textarea, input')) {
        e.preventDefault();
        toggleTimer();
      } else if (e.code === 'KeyJ' && !e.target.matches('textarea, input')) {
        e.preventDefault();
        interruptionRef.current?.focus();
      } else if (e.code === 'KeyN' && !e.target.matches('textarea, input')) {
        e.preventDefault();
        noteRef.current?.focus();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        setShowEndModal(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  const toggleTimer = async () => {
    if (!session) return;
    
    const eventType = isPaused ? 'resume' : 'pause';
    
    try {
      const response = await fetch('/api/focus/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          type: eventType
        })
      });
      
      if (response.ok) {
        setIsPaused(!isPaused);
      }
    } catch (error) {
      console.error('Failed to toggle timer:', error);
    }
  };
  
  const logInterruption = async () => {
    if (!interruptionText.trim() || !session) return;
    
    try {
      const response = await fetch('/api/focus/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          type: 'distraction',
          payload: { text: interruptionText }
        })
      });
      
      if (response.ok) {
        setInterruptionText('');
      }
    } catch (error) {
      console.error('Failed to log interruption:', error);
    }
  };
  
  const logQuickNote = async () => {
    if (!quickNote.trim() || !session) return;
    
    try {
      const response = await fetch('/api/focus/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          type: 'note',
          payload: { text: quickNote }
        })
      });
      
      if (response.ok) {
        setQuickNote('');
      }
    } catch (error) {
      console.error('Failed to log note:', error);
    }
  };
  
  const endSession = async () => {
    if (!session) return;
    
    try {
      const response = await fetch('/api/focus/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          selfRating: selfRating || undefined
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        // Show summary and navigate back
        let summaryText = `Session completed!\nDuration: ${result.summary.duration} minutes\nDistractions: ${result.summary.distractions}\nEfficiency: ${result.summary.efficiency}%`;
        
        if (result.summary.intention) {
          summaryText += `\n\nIntention: ${result.summary.intention}`;
        }
        
        if (result.summary.rating) {
          summaryText += `\nRating: ${result.summary.rating}/5`;
        }
        
        alert(summaryText);
        navigate('/tasks');
      }
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatISTTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading focus session...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top strip */}
      <div className="bg-gray-800 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="text-2xl font-mono">
            ⏱ {formatTime(elapsedSeconds)}
          </div>
          <div className="text-sm text-gray-300">
            Planned: {session.plannedMinutes}m
          </div>
          <div className="text-sm text-gray-300">
            Target: {formatISTTime(session.targetEnd)}
          </div>
          {ritual && (
            <div className="flex items-center space-x-2 text-xs text-gray-400 opacity-60">
              {ritual.tabsClosed && <span>Tabs ✓</span>}
              {ritual.phoneSilent && <span>Phone ✓</span>}
              {ritual.materialsReady && <span>Materials ✓</span>}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/tasks')}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back to Tasks
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex h-screen">
        {/* Main focus area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-light mb-8 leading-relaxed">
              {session.task.title}
            </h1>
            
            {/* Intention display */}
            {intention && (
              <div className="mb-8 text-center">
                <p className="text-lg text-gray-300 italic">
                  Intention: {intention}
                </p>
              </div>
            )}
            
            {/* Subtasks */}
            {session.task.subtasks && (
              <div className="mb-12">
                {session.task.subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center justify-center mb-3">
                    <div className="w-4 h-4 border border-gray-500 rounded mr-3"></div>
                    <span className="text-lg text-gray-300">{subtask}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Big timer */}
            <div className="text-8xl font-mono font-light mb-8">
              {formatTime(elapsedSeconds)}
            </div>
            
            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleTimer}
                className={`px-8 py-3 rounded-lg font-medium ${
                  isPaused 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={() => setShowEndModal(true)}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
              >
                End Session
              </button>
            </div>
            
            {/* Keyboard shortcuts */}
            <div className="mt-8 text-sm text-gray-400">
              <p>Space: Start/Pause • J: Interruption • N: Note • Esc: End</p>
            </div>
          </div>
        </div>
        
        {/* Right panel */}
        <div className="w-80 bg-gray-800 p-6 flex flex-col">
          <h3 className="text-lg font-medium mb-4">Interruption Inbox</h3>
          <textarea
            ref={interruptionRef}
            value={interruptionText}
            onChange={(e) => setInterruptionText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                logInterruption();
              }
            }}
            placeholder="What interrupted you? (Enter to log)"
            className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none mb-6"
          />
          
          <h3 className="text-lg font-medium mb-4">Quick Note</h3>
          <textarea
            ref={noteRef}
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                e.preventDefault();
                logQuickNote();
              }
            }}
            placeholder="Quick thoughts... (Cmd+Enter to save)"
            className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
          />
        </div>
      </div>
      
      {/* End session modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-medium mb-6">End Focus Session</h2>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                How would you rate this session? (1-5)
              </p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelfRating(rating)}
                    className={`w-12 h-12 rounded-full border-2 ${
                      selfRating === rating
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEndModal(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={endSession}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusMode;
