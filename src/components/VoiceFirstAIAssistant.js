// Voice-First AI Assistant Component for LifeOS
// Enhanced with voice recording, inbox management, and one-task-at-a-time processing

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Mic,
  MicOff,
  Bot,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Flag,
  Target,
  Zap,
  X,
  Play,
  Pause,
  Trash2,
  Edit3,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Brain,
  MessageSquare,
  User,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  MoreHorizontal,
  Star,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Flag as FlagIcon,
  Target as TargetIcon,
  GripVertical,
  CheckSquare,
  Square,
  Archive,
  Tag,
  Folder,
  Users,
  Heart,
  DollarSign,
  BookOpen,
  Home,
  Briefcase,
  Monitor
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { aiAssistant } from '../lib/aiAssistant';
import toast from 'react-hot-toast';

const VoiceFirstAIAssistant = () => {
  const { addTask, tasks, projects, areas } = useData();
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  
  // AI Assistant state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState('available');
  
  // Inbox management state
  const [inboxTasks, setInboxTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showInbox, setShowInbox] = useState(false);
  const [inboxFilter, setInboxFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Task processing state
  const [isProcessingTask, setIsProcessingTask] = useState(false);
  const [processingOptions, setProcessingOptions] = useState({
    dueDate: null,
    priority: 'medium',
    project: null,
    area: null,
    tags: [],
    estimatedDuration: null,
    energyLevel: 'medium',
    context: null,
    notes: ''
  });
  
  // Calendar integration state
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  
  // UI state
  const [isMinimized, setIsMinimized] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  const [waveformData, setWaveformData] = useState([]);
  
  // Enhanced inbox state
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Refs
  const messagesEndRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Animation variants for consistent motion
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: "easeOut" }
  };

  const pulse = {
    animate: { 
      scale: [1, 1.05, 1],
      transition: { 
        duration: 2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      } 
    }
  };

  // Initialize AI Assistant
  useEffect(() => {
    initializeAssistant();
    loadInboxTasks();
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load inbox tasks
  const loadInboxTasks = async () => {
    try {
      const tasks = await aiAssistant.getInboxTasks();
      setInboxTasks(tasks);
    } catch (error) {
      console.error('Error loading inbox tasks:', error);
      toast.error('Failed to load inbox tasks');
    }
  };

  // Initialize AI Assistant
  const initializeAssistant = () => {
    const welcomeMessage = {
      id: 1,
      type: 'assistant',
      content: `🎤 **Voice-First AI Assistant Ready!**\n\nI'm your intelligent productivity companion. Here's what I can do:\n\n• **Voice Capture**: Click the mic button and speak naturally\n• **AI Processing**: I'll extract tasks, deadlines, and priorities\n• **Inbox Management**: All tasks go to your inbox first (GTD method)\n• **One-Task Processing**: Process tasks one at a time for focus\n\nTry saying: "Call John tomorrow at 2pm about the project" or "Schedule workout for next week"`,
      timestamp: new Date(),
      suggestions: [
        { text: 'Start voice recording', icon: Mic, action: 'start-recording' },
        { text: 'Show inbox tasks', icon: Target, action: 'show-inbox' },
        { text: 'Process next task', icon: ArrowRight, action: 'process-task' }
      ]
    };
    setMessages([welcomeMessage]);
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        await processVoiceRecording(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Set up audio analysis for waveform
      setupAudioAnalysis(stream);
      
      mediaRecorder.start();
      setMediaRecorder(mediaRecorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      setRecordingDuration(0);
      setShowWaveform(true);
      
      // Start duration timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success('Recording started! Speak naturally...');
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setShowWaveform(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      toast.success('Recording stopped! Processing...');
    }
  };

  const setupAudioAnalysis = (stream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateWaveform = () => {
        if (isRecording) {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          setWaveformData(Array.from(dataArray));
          animationFrameRef.current = requestAnimationFrame(updateWaveform);
        }
      };
      
      updateWaveform();
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  };

  const processVoiceRecording = async (audioBlob) => {
    setIsProcessing(true);
    setAiStatus('loading');
    
    try {
      // Simulate voice-to-text processing
      const mockTranscription = "Call John tomorrow at 2pm about the project, schedule workout for next week, and review the quarterly report";
      
      // Process with AI Assistant
      const result = await aiAssistant.processVoiceCapture(mockTranscription);
      
      if (result.success) {
        // Add AI response to messages
        const aiMessage = {
          id: Date.now(),
          type: 'assistant',
          content: result.message,
          timestamp: new Date(),
          tasksCreated: result.tasksCreated,
          tasks: result.tasks
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Reload inbox tasks
        await loadInboxTasks();
        
        toast.success(`Captured ${result.tasks?.length || 0} tasks! Check your inbox.`);
      } else {
        throw new Error(result.error || 'Voice processing failed');
      }
      
    } catch (error) {
      console.error('Error processing voice recording:', error);
      toast.error('Failed to process voice recording. Please try again.');
      
      const errorMessage = {
        id: Date.now(),
        type: 'assistant',
        content: 'Sorry, I had trouble processing your voice input. Please try again or type your message.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      setAiStatus('available');
    }
  };

  // Chat functions
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setAiStatus('loading');

    try {
      const result = await aiAssistant.chatWithAssistant(inputMessage, {
        currentTask: inboxTasks[currentTaskIndex],
        inboxTasks: inboxTasks
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: result.message,
        timestamp: new Date(),
        action: result.action
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Handle specific actions
      if (result.action === 'show_inbox') {
        setShowInbox(true);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setAiStatus('available');
    }
  };

  // Inbox management functions
  const getCurrentTask = () => {
    return inboxTasks[currentTaskIndex] || null;
  };

  const getNextTask = () => {
    if (currentTaskIndex < inboxTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const getPreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };

  const processCurrentTask = async () => {
    const currentTask = getCurrentTask();
    if (!currentTask) return;

    setIsProcessingTask(true);

    try {
      // Prepare enhanced processing data
      const enhancedOptions = {
        ...processingOptions,
        status: 'processed',
        processed_at: new Date().toISOString(),
        due_date: selectedDate ? new Date(`${selectedDate}T${selectedTime || '09:00'}`).toISOString() : processingOptions.dueDate,
        metadata: {
          estimatedDuration: processingOptions.estimatedDuration,
          energyLevel: processingOptions.energyLevel,
          context: processingOptions.context,
          notes: processingOptions.notes
        }
      };

      const result = await aiAssistant.processTask(currentTask.id, enhancedOptions);

      if (result.success) {
        // Show celebration
        showTaskCelebration(currentTask);
        
        // Remove from inbox and move to next task
        setInboxTasks(prev => prev.filter(task => task.id !== currentTask.id));
        
        if (currentTaskIndex >= inboxTasks.length - 1) {
          setCurrentTaskIndex(Math.max(0, currentTaskIndex - 1));
        }
        
        // Reset processing options
        resetProcessingOptions();
        
        // Add celebration message to chat
        const celebrationMessage = {
          id: Date.now(),
          type: 'assistant',
          content: `🎉 Excellent! Task "${currentTask.title}" has been processed and organized. ${inboxTasks.length - 1} tasks remaining in inbox.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, celebrationMessage]);
        
      } else {
        throw new Error(result.error || 'Failed to process task');
      }
      
    } catch (error) {
      console.error('Error processing task:', error);
      toast.error('Failed to process task. Please try again.');
    } finally {
      setIsProcessingTask(false);
    }
  };

  const showTaskCelebration = (task) => {
    const celebrations = [
      `🎉 Task "${task.title}" processed successfully!`,
      `✨ Great job organizing "${task.title}"!`,
      `🚀 Task "${task.title}" is now ready to go!`,
      `💪 You're crushing it! "${task.title}" is processed!`,
      `⭐ Task "${task.title}" organized like a pro!`
    ];
    
    const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
    setCelebrationMessage(randomCelebration);
    setShowCelebration(true);
    
    // Auto-hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const resetProcessingOptions = () => {
    setProcessingOptions({
      dueDate: null,
      priority: 'medium',
      project: null,
      area: null,
      tags: [],
      estimatedDuration: null,
      energyLevel: 'medium',
      context: null,
      notes: ''
    });
    setSelectedDate(null);
    setSelectedTime(null);
    setShowCalendarPicker(false);
  };

  const addTag = (tag) => {
    if (!processingOptions.tags.includes(tag)) {
      setProcessingOptions(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag) => {
    setProcessingOptions(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const getEnergyLevelColor = (level) => {
    const colors = {
      'low': 'bg-red-100 text-red-700 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'high': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[level] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getDurationOptions = () => [
    { value: '5', label: '5 min' },
    { value: '15', label: '15 min' },
    { value: '30', label: '30 min' },
    { value: '60', label: '1 hour' },
    { value: '120', label: '2 hours' },
    { value: '240', label: '4 hours' },
    { value: '480', label: '8 hours' }
  ];

  const getContextOptions = () => [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'office', label: 'Office', icon: Briefcase },
    { value: 'phone', label: 'Phone', icon: MessageSquare },
    { value: 'computer', label: 'Computer', icon: Monitor },
    { value: 'meeting', label: 'Meeting', icon: Users },
    { value: 'errands', label: 'Errands', icon: Calendar }
  ];

  const deleteTask = async (taskId) => {
    try {
      // Remove from inbox
      setInboxTasks(prev => prev.filter(task => task.id !== taskId));
      
      if (currentTaskIndex >= inboxTasks.length - 1) {
        setCurrentTaskIndex(Math.max(0, currentTaskIndex - 1));
      }
      
      toast.success('Task deleted from inbox');
      
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Drag and drop handlers
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setInboxTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Enhanced inbox functions
  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const selectAllTasks = () => {
    const filteredTasks = getFilteredAndSortedTasks();
    setSelectedTasks(filteredTasks.map(task => task.id));
  };

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  const bulkProcessTasks = async (action) => {
    if (selectedTasks.length === 0) return;

    setIsProcessingTask(true);

    try {
      for (const taskId of selectedTasks) {
        await aiAssistant.processTask(taskId, {
          status: action === 'archive' ? 'archived' : 'processed',
          processed_at: new Date().toISOString()
        });
      }

      // Remove processed tasks from inbox
      setInboxTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
      
      toast.success(`${selectedTasks.length} tasks ${action === 'archive' ? 'archived' : 'processed'} successfully!`);
      
      // Clear selection and exit bulk mode
      setSelectedTasks([]);
      setBulkActionMode(false);
      setShowBulkActions(false);
      
    } catch (error) {
      console.error('Error bulk processing tasks:', error);
      toast.error('Failed to process tasks. Please try again.');
    } finally {
      setIsProcessingTask(false);
    }
  };

  const bulkDeleteTasks = async () => {
    if (selectedTasks.length === 0) return;

    try {
      setInboxTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
      toast.success(`${selectedTasks.length} tasks deleted successfully!`);
      
      setSelectedTasks([]);
      setBulkActionMode(false);
      setShowBulkActions(false);
      
    } catch (error) {
      console.error('Error deleting tasks:', error);
      toast.error('Failed to delete tasks. Please try again.');
    }
  };

  // Sort and filter functions
  const getFilteredAndSortedTasks = () => {
    let filtered = inboxTasks;
    
    if (inboxFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === inboxFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort tasks
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'created_at' || sortBy === 'due_date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  };

  const getLifeAreaIcon = (area) => {
    const icons = {
      'health': Heart,
      'finance': DollarSign,
      'career': Briefcase,
      'relationships': Users,
      'learning': BookOpen,
      'personal_growth': Target,
      'hobbies': Star,
      'family': Home,
      'social': Users,
      'spiritual': Heart,
      'travel': Calendar,
      'home': Home
    };
    return icons[area] || Folder;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-700 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'low': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Render waveform visualization with enhanced animations
  const renderWaveform = () => {
    if (!showWaveform || waveformData.length === 0) return null;

    return (
      <motion.div 
        className="flex items-center justify-center space-x-1 h-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {waveformData.slice(0, 20).map((value, index) => (
          <motion.div
            key={index}
            className="w-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full"
            style={{ height: `${Math.max(2, (value / 255) * 20)}px` }}
            animate={{ 
              height: `${Math.max(2, (value / 255) * 20)}px`,
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 0.1,
              delay: index * 0.01,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    );
  };

  // Sortable Task Item Component
  const SortableTaskItem = ({ task, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const isSelected = selectedTasks.includes(task.id);
    const isCurrent = index === currentTaskIndex;
    const LifeAreaIcon = getLifeAreaIcon(task.life_area);

    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          borderColor: isCurrent ? '#3b82f6' : isSelected ? '#8b5cf6' : '#e5e7eb'
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ 
          duration: 0.2,
          ease: "easeOut"
        }}
        className={`p-3 sm:p-4 border rounded-lg transition-all ${
          isDragging ? 'opacity-50 shadow-lg rotate-2' : ''
        } ${
          isCurrent 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : isSelected
              ? 'border-purple-500 bg-purple-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-start space-x-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </div>

          {/* Selection Checkbox */}
          {bulkActionMode && (
            <div className="flex-shrink-0 pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTaskSelection(task.id);
                }}
                className="text-gray-400 hover:text-purple-500 transition-colors"
              >
                {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
              </button>
            </div>
          )}

          {/* Task Content */}
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => setCurrentTaskIndex(index)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                )}
                
                {/* Task Metadata */}
                <div className="flex items-center space-x-2 mt-2">
                  {task.priority && (
                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                      <FlagIcon size={12} className="inline mr-1" />
                      {task.priority}
                    </span>
                  )}
                  
                  {task.life_area && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                      <LifeAreaIcon size={12} className="inline mr-1" />
                      {task.life_area}
                    </span>
                  )}
                  
                  {task.due_date && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                      <CalendarIcon size={12} className="inline mr-1" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                  
                  {task.tags && task.tags.length > 0 && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full border border-green-200">
                      <Tag size={12} className="inline mr-1" />
                      {task.tags.length} tags
                    </span>
                  )}
                </div>

                {/* Source and Timestamp */}
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                  {task.source && (
                    <span className="flex items-center">
                      {task.source === 'voice_capture' ? <Mic size={12} className="mr-1" /> : <Edit3 size={12} className="mr-1" />}
                      {task.source.replace('_', ' ')}
                    </span>
                  )}
                  <span>{new Date(task.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render current task processing interface
  const renderTaskProcessing = () => {
    const currentTask = getCurrentTask();
    if (!currentTask) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Process Task</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={getPreviousTask}
              disabled={currentTaskIndex === 0}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="text-sm text-gray-500">
              {currentTaskIndex + 1} of {inboxTasks.length}
            </span>
            <button
              onClick={getNextTask}
              disabled={currentTaskIndex === inboxTasks.length - 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">{currentTask.title}</h4>
          {currentTask.description && (
            <p className="text-sm text-gray-600">{currentTask.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => setProcessingOptions(prev => ({ ...prev, dueDate: 'today' }))}
                className={`px-3 py-1 text-sm rounded-full ${
                  processingOptions.dueDate === 'today' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setProcessingOptions(prev => ({ ...prev, dueDate: 'tomorrow' }))}
                className={`px-3 py-1 text-sm rounded-full ${
                  processingOptions.dueDate === 'tomorrow' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => setProcessingOptions(prev => ({ ...prev, dueDate: 'next-week' }))}
                className={`px-3 py-1 text-sm rounded-full ${
                  processingOptions.dueDate === 'next-week' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Next Week
              </button>
              <button
                onClick={() => setShowCalendarPicker(!showCalendarPicker)}
                className={`px-3 py-1 text-sm rounded-full ${
                  showCalendarPicker 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <CalendarIcon size={14} className="inline mr-1" />
                Custom
              </button>
            </div>
            
            {/* Calendar Picker */}
            {showCalendarPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={selectedDate || ''}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                    <input
                      type="time"
                      value={selectedTime || ''}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex space-x-2">
              {['low', 'medium', 'high'].map(priority => (
                <button
                  key={priority}
                  onClick={() => setProcessingOptions(prev => ({ ...prev, priority }))}
                  className={`px-3 py-1 text-sm rounded-full border ${getPriorityColor(priority)}`}
                >
                  <FlagIcon size={12} className="inline mr-1" />
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy Level Required
            </label>
            <div className="flex space-x-2">
              {['low', 'medium', 'high'].map(level => (
                <button
                  key={level}
                  onClick={() => setProcessingOptions(prev => ({ ...prev, energyLevel: level }))}
                  className={`px-3 py-1 text-sm rounded-full border ${getEnergyLevelColor(level)}`}
                >
                  {level === 'low' ? '😴' : level === 'medium' ? '⚡' : '🔥'} {level}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Duration
            </label>
            <div className="flex flex-wrap gap-2">
              {getDurationOptions().map(option => (
                <button
                  key={option.value}
                  onClick={() => setProcessingOptions(prev => ({ ...prev, estimatedDuration: option.value }))}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    processingOptions.estimatedDuration === option.value 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  <ClockIcon size={12} className="inline mr-1" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Context
            </label>
            <div className="flex flex-wrap gap-2">
              {getContextOptions().map(option => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setProcessingOptions(prev => ({ ...prev, context: option.value }))}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      processingOptions.context === option.value 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <IconComponent size={12} className="inline mr-1" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {processingOptions.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full border border-blue-200 flex items-center"
                >
                  <Tag size={10} className="mr-1" />
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {['urgent', 'important', 'quick-win', 'research', 'creative', 'admin'].map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  disabled={processingOptions.tags.includes(tag)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project
            </label>
            <select
              value={processingOptions.project || ''}
              onChange={(e) => setProcessingOptions(prev => ({ ...prev, project: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select project...</option>
              {projects?.map(project => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          {/* Life Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Life Area
            </label>
            <select
              value={processingOptions.area || ''}
              onChange={(e) => setProcessingOptions(prev => ({ ...prev, area: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select life area...</option>
              {areas?.map(area => (
                <option key={area.id} value={area.id}>
                  {area.title}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={processingOptions.notes}
              onChange={(e) => setProcessingOptions(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional context or notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="2"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-6">
          <button
            onClick={() => deleteTask(currentTask.id)}
            className="px-3 sm:px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation"
          >
            Delete Task
          </button>
          <button
            onClick={processCurrentTask}
            disabled={isProcessingTask}
            className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation"
          >
            {isProcessingTask ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Process Task
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-lg p-6 sm:p-8 shadow-xl max-w-md w-full text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: 2
                }}
                className="text-4xl sm:text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Task Processed!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                {celebrationMessage}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCelebration(false)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation"
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Voice-First AI Assistant</h1>
              <p className="text-sm text-gray-600">Speak naturally, I'll capture and organize everything</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
              aiStatus === 'available' ? 'bg-green-50' :
              aiStatus === 'loading' ? 'bg-blue-50' :
              'bg-red-50'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                aiStatus === 'available' ? 'bg-green-400' :
                aiStatus === 'loading' ? 'bg-blue-400 animate-pulse' :
                'bg-red-400'
              }`}></div>
              <span className={`text-sm font-medium ${
                aiStatus === 'available' ? 'text-green-600' :
                aiStatus === 'loading' ? 'text-blue-600' :
                'text-red-600'
              }`}>
                {aiStatus === 'available' ? 'Ready' : 
                 aiStatus === 'loading' ? 'Processing...' : 'Error'}
              </span>
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Chat */}
        <div className={`flex-1 flex flex-col ${isMinimized ? 'hidden' : ''}`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : message.error
                          ? 'bg-red-50 border border-red-200 text-red-800'
                          : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.type === 'assistant' && (
                        <div className="p-1 bg-purple-100 rounded-full">
                          <Bot className="w-4 h-4 text-purple-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                        {message.suggestions && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-gray-500 font-medium">Quick actions:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    if (suggestion.action === 'start-recording') {
                                      startRecording();
                                    } else if (suggestion.action === 'show-inbox') {
                                      setShowInbox(true);
                                    } else if (suggestion.action === 'process-task') {
                                      setShowInbox(true);
                                    }
                                  }}
                                  className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                                >
                                  <suggestion.icon className="w-3 h-3" />
                                  <span>{suggestion.text}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-1 bg-purple-100 rounded-full">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
            {/* Voice Recording Controls */}
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isRecording ? pulse.animate : {}}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`p-3 sm:p-4 rounded-full transition-all min-h-[48px] min-w-[48px] touch-manipulation relative overflow-hidden ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing && (
                  <motion.div
                    className="absolute inset-0 bg-white opacity-20"
                    animate={{ 
                      x: ['-100%', '100%'],
                      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                )}
                <motion.div
                  animate={isRecording ? { 
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.5, repeat: Infinity }
                  } : {}}
                >
                  {isRecording ? <MicOff size={20} className="sm:w-6 sm:h-6" /> : <Mic size={20} className="sm:w-6 sm:h-6" />}
                </motion.div>
              </motion.button>
              
              {isRecording && (
                <div className="text-center">
                  <div className="text-sm font-medium text-red-600">
                    Recording... {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                  </div>
                  {renderWaveform()}
                </div>
              )}
              
              {isProcessing && (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-600">Processing voice...</span>
                </div>
              )}
            </div>

            {/* Text Input */}
            <div className="flex items-end space-x-2 sm:space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Or type your message here..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base min-h-[44px]"
                  rows="2"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] touch-manipulation relative overflow-hidden"
              >
                {isLoading && (
                  <motion.div
                    className="absolute inset-0 bg-white opacity-20"
                    animate={{ 
                      x: ['-100%', '100%'],
                      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                )}
                <motion.div
                  animate={isLoading ? { 
                    rotate: 360,
                    transition: { duration: 1, repeat: Infinity, ease: "linear" }
                  } : {}}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5" />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Right Panel - Inbox & Task Processing */}
        <div className={`w-full lg:w-96 bg-white border-t lg:border-l border-gray-200 flex flex-col ${isMinimized ? 'hidden' : ''}`}>
          {/* Inbox Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Inbox</h3>
              <div className="flex items-center space-x-2">
                {/* Bulk Action Toggle */}
                <button
                  onClick={() => {
                    setBulkActionMode(!bulkActionMode);
                    if (bulkActionMode) {
                      setSelectedTasks([]);
                    }
                  }}
                  className={`p-1 rounded-lg transition-colors ${
                    bulkActionMode 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Toggle bulk actions"
                >
                  <CheckSquare size={16} />
                </button>
                
                <button
                  onClick={() => setShowInbox(!showInbox)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {showInbox ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {inboxTasks.length}
                </span>
              </div>
            </div>

            {showInbox && (
              <div className="space-y-3">
                {/* Search and Filter */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Filters and Sort */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {['all', 'high', 'medium', 'low'].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setInboxFilter(filter)}
                          className={`px-2 py-1 text-xs rounded-full ${
                            inboxFilter === filter 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    
                    {/* Sort Options */}
                    <div className="flex items-center space-x-1">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="created_at">Created</option>
                        <option value="due_date">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                      >
                        {sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Inbox Content */}
          <div className="flex-1 overflow-y-auto">
            {showInbox ? (
              <div className="p-3 sm:p-4">
                {/* Bulk Actions Bar */}
                {bulkActionMode && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-purple-700">
                          {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                        </span>
                        <button
                          onClick={clearSelection}
                          className="text-xs text-purple-600 hover:text-purple-800"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => bulkProcessTasks('process')}
                          disabled={isProcessingTask}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                          Process All
                        </button>
                        <button
                          onClick={() => bulkProcessTasks('archive')}
                          disabled={isProcessingTask}
                          className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 disabled:opacity-50"
                        >
                          Archive All
                        </button>
                        <button
                          onClick={bulkDeleteTasks}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                        >
                          Delete All
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tasks List */}
                {inboxTasks.length === 0 && !isProcessing ? (
                  <motion.div 
                    className="text-center py-8 text-gray-500"
                    {...fadeInUp}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    </motion.div>
                    <p className="text-sm">No tasks in inbox</p>
                    <p className="text-xs text-gray-400 mt-1">Use voice capture to add tasks</p>
                  </motion.div>
                ) : inboxTasks.length === 0 && isProcessing ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={getFilteredAndSortedTasks().map(task => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {getFilteredAndSortedTasks().map((task, index) => (
                          <SortableTaskItem
                            key={task.id}
                            task={task}
                            index={index}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            ) : (
              <div className="p-3 sm:p-4">
                {renderTaskProcessing()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceFirstAIAssistant;
