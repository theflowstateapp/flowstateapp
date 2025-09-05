import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Zap,
  CheckCircle,
  Target,
  FileText,
  MessageSquare,
  User,
  Flag,
  BookOpen,
  Trash2
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

const VoiceCapture = () => {
  const { addTask, addProject, addNote, addGoal } = useData();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('task');
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);

  const categories = [
    { id: 'task', name: 'Task', icon: CheckCircle, color: 'text-blue-600' },
    { id: 'project', name: 'Project', icon: Target, color: 'text-purple-600' },
    { id: 'note', name: 'Note', icon: FileText, color: 'text-green-600' },
    { id: 'meeting', name: 'Meeting', icon: MessageSquare, color: 'text-orange-600' },
    { id: 'contact', name: 'Contact', icon: User, color: 'text-pink-600' },
    { id: 'goal', name: 'Goal', icon: Flag, color: 'text-red-600' },
    { id: 'reference', name: 'Reference', icon: BookOpen, color: 'text-indigo-600' }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const newRecording = {
          id: Date.now(),
          url,
          blob,
          timestamp: new Date(),
          category: selectedCategory,
          transcription: '',
          processed: false
        };
        setRecordings(prev => [newRecording, ...prev]);
        setCurrentRecording(newRecording);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = (recording) => {
    if (audioRef.current) {
      audioRef.current.src = recording.url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const processRecording = async (recording) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockTranscription = `Voice note: ${recording.category} - ${new Date().toLocaleTimeString()}`;
      setTranscription(mockTranscription);
      
      // Update recording with transcription
      setRecordings(prev => prev.map(r => 
        r.id === recording.id 
          ? { ...r, transcription: mockTranscription, processed: true }
          : r
      ));
      
      setIsProcessing(false);
    }, 2000);
  };

  const saveAsItem = (recording) => {
    const item = {
      title: transcription || `Voice ${recording.category}`,
      description: `Recorded on ${recording.timestamp.toLocaleString()}`,
      category: recording.category,
      voiceNote: recording.url
    };

    switch (recording.category) {
      case 'task':
        addTask(item);
        break;
      case 'project':
        addProject(item);
        break;
      case 'note':
        addNote(item);
        break;
      case 'goal':
        addGoal(item);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('Category not supported for auto-save');
    }

    // Remove from recordings after saving
    setRecordings(prev => prev.filter(r => r.id !== recording.id));
    setTranscription('');
  };

  const deleteRecording = (recordingId) => {
    setRecordings(prev => prev.filter(r => r.id !== recordingId));
    if (currentRecording?.id === recordingId) {
      setCurrentRecording(null);
      setTranscription('');
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, []);

  return (
    <div className="p-4 space-y-6" data-testid="voice-capture-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voice Capture</h1>
          <p className="text-sm text-gray-600">Record and process voice notes with AI</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{recordings.length} recordings</span>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-center space-x-6">
          {/* Category Selection */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Recording Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-4 rounded-full transition-colors ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
          </motion.button>

          {/* Status */}
          <div className="text-center">
            <div className={`text-sm font-medium ${isRecording ? 'text-red-600' : 'text-gray-600'}`}>
              {isRecording ? 'Recording...' : 'Ready to record'}
            </div>
            {isRecording && (
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Click to stop</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Recording Processing */}
      {currentRecording && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Processing Recording</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => playRecording(currentRecording)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Play size={16} />
              </button>
              <button
                onClick={pauseRecording}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Pause size={16} />
              </button>
            </div>
          </div>

          {isProcessing ? (
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">AI is processing your voice note...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transcription
                </label>
                <textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="AI transcription will appear here..."
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => processRecording(currentRecording)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Zap size={16} className="inline mr-2" />
                  Process with AI
                </button>
                <button
                  onClick={() => saveAsItem(currentRecording)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <CheckCircle size={16} className="inline mr-2" />
                  Save as {categories.find(c => c.id === currentRecording.category)?.name}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Recordings List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Recordings</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recordings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Mic size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No recordings yet. Start by recording a voice note above.</p>
            </div>
          ) : (
            recordings.map((recording) => {
              const category = categories.find(c => c.id === recording.category);
              return (
                <motion.div
                  key={recording.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${category?.color.replace('text', 'bg').replace('-600', '-50')}`}>
                      {category?.icon && <category.icon className={`w-5 h-5 ${category?.color}`} />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{category?.name}</span>
                        {recording.processed && (
                          <CheckCircle size={16} className="text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {recording.timestamp.toLocaleString()}
                      </p>
                      {recording.transcription && (
                        <p className="text-sm text-gray-500 mt-1">
                          {recording.transcription.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => playRecording(recording)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Play size={16} />
                    </button>
                    <button
                      onClick={() => deleteRecording(recording.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default VoiceCapture;
