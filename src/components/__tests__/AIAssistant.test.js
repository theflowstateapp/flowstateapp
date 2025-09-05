import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIAssistant from '../components/AIAssistant';

// Mock the aiAssistant module
jest.mock('../../lib/aiAssistant', () => ({
  aiAssistant: {
    processVoiceCapture: jest.fn(),
    chatWithAssistant: jest.fn(),
    getInboxTasks: jest.fn()
  },
  AI_FEATURES: {
    VOICE_CAPTURE: 'voice_capture',
    INBOX_MANAGEMENT: 'inbox_management'
  },
  TASK_TAGS: {
    URGENT: 'urgent',
    IMPORTANT: 'important'
  }
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

// Mock MediaRecorder
global.MediaRecorder = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}));

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }]
    })
  },
  writable: true
});

// Mock AudioContext
global.AudioContext = jest.fn().mockImplementation(() => ({
  createAnalyser: jest.fn().mockReturnValue({
    fftSize: 256,
    frequencyBinCount: 128,
    getByteFrequencyData: jest.fn()
  }),
  createMediaStreamSource: jest.fn().mockReturnValue({
    connect: jest.fn()
  }),
  close: jest.fn()
}));

describe('AIAssistant Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders floating button when closed', () => {
    render(<AIAssistant />);
    
    const aiButton = screen.getByText('AI Assistant');
    expect(aiButton).toBeInTheDocument();
    expect(aiButton.closest('button')).toHaveClass('bg-gradient-to-r');
  });

  test('opens AI Assistant window when button is clicked', async () => {
    render(<AIAssistant />);
    
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      expect(screen.getByText('🎤 Capture')).toBeInTheDocument();
      expect(screen.getByText('📋 Process')).toBeInTheDocument();
    });
  });

  test('closes AI Assistant window when close button is clicked', async () => {
    render(<AIAssistant />);
    
    // Open AI Assistant
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      expect(screen.getByText('🎤 Capture')).toBeInTheDocument();
    });
    
    // Close AI Assistant
    const closeButton = screen.getByTitle('Close');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('🎤 Capture')).not.toBeInTheDocument();
    });
  });

  test('minimizes AI Assistant when minimize button is clicked', async () => {
    render(<AIAssistant />);
    
    // Open AI Assistant
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      expect(screen.getByText('🎤 Capture')).toBeInTheDocument();
    });
    
    // Minimize AI Assistant
    const minimizeButton = screen.getByTitle('Minimize');
    fireEvent.click(minimizeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('🎤 Capture')).not.toBeInTheDocument();
    });
  });

  test('starts voice recording when mic button is clicked', async () => {
    render(<AIAssistant />);
    
    // Open AI Assistant
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      const micButton = screen.getByRole('button', { name: /mic/i });
      fireEvent.click(micButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Recording...')).toBeInTheDocument();
    });
  });

  test('switches between capture and process modes', async () => {
    render(<AIAssistant />);
    
    // Open AI Assistant
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      const captureButton = screen.getByText('🎤 Capture');
      const processButton = screen.getByText('📋 Process');
      
      // Initially in capture mode
      expect(captureButton).toHaveClass('bg-blue-600');
      
      // Switch to process mode
      fireEvent.click(processButton);
      expect(processButton).toHaveClass('bg-green-600');
    });
  });

  test('handles text input and sends messages', async () => {
    const mockChatWithAssistant = require('../lib/aiAssistant').aiAssistant.chatWithAssistant;
    mockChatWithAssistant.mockResolvedValue({
      success: true,
      message: 'I received your message'
    });

    render(<AIAssistant />);
    
    // Open AI Assistant
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      const textInput = screen.getByPlaceholderText(/Type or speak your tasks/);
      const sendButton = screen.getByRole('button', { name: /send/i });
      
      fireEvent.change(textInput, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
    });
    
    await waitFor(() => {
      expect(mockChatWithAssistant).toHaveBeenCalledWith('Test message', expect.any(Object));
    });
  });

  test('displays inbox tasks when inbox button is clicked', async () => {
    const mockGetInboxTasks = require('../lib/aiAssistant').aiAssistant.getInboxTasks;
    mockGetInboxTasks.mockResolvedValue([
      { id: 1, title: 'Test Task 1', description: 'Test Description 1' },
      { id: 2, title: 'Test Task 2', description: 'Test Description 2' }
    ]);

    render(<AIAssistant />);
    
    // Open AI Assistant
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      const inboxButton = screen.getByTitle('Toggle Inbox');
      fireEvent.click(inboxButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Inbox Tasks:')).toBeInTheDocument();
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('handles voice recording errors gracefully', async () => {
    // Mock getUserMedia to throw an error
    navigator.mediaDevices.getUserMedia.mockRejectedValue(new Error('Permission denied'));

    render(<AIAssistant />);
    
    // Open AI Assistant
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      const micButton = screen.getByRole('button', { name: /mic/i });
      fireEvent.click(micButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Microphone access denied/)).toBeInTheDocument();
    });
  });

  test('displays recording duration', async () => {
    jest.useFakeTimers();

    render(<AIAssistant />);
    
    // Open AI Assistant
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      const micButton = screen.getByRole('button', { name: /mic/i });
      fireEvent.click(micButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Recording...')).toBeInTheDocument();
    });
    
    // Advance timer by 1 second
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('0:01')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  test('shows waveform visualization during recording', async () => {
    render(<AIAssistant />);
    
    // Open AI Assistant
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      const micButton = screen.getByRole('button', { name: /mic/i });
      fireEvent.click(micButton);
    });
    
    await waitFor(() => {
      // Check for waveform bars
      const waveformBars = document.querySelectorAll('.bg-red-400.rounded-sm');
      expect(waveformBars.length).toBeGreaterThan(0);
    });
  });

  test('handles quick action buttons', async () => {
    render(<AIAssistant />);
    
    // Open AI Assistant
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      const quickTaskButton = screen.getByText('Quick Task');
      fireEvent.click(quickTaskButton);
    });
    
    await waitFor(() => {
      const textInput = screen.getByPlaceholderText(/Type or speak your tasks/);
      expect(textInput).toHaveValue('Schedule a meeting with the team for next week');
    });
  });

  test('displays unprocessed task count', async () => {
    const mockGetInboxTasks = require('../lib/aiAssistant').aiAssistant.getInboxTasks;
    mockGetInboxTasks.mockResolvedValue([
      { id: 1, title: 'Task 1', status: 'inbox' },
      { id: 2, title: 'Task 2', status: 'inbox' },
      { id: 3, title: 'Task 3', status: 'processed' }
    ]);

    render(<AIAssistant />);
    
    // Wait for inbox tasks to load
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  test('processes current task with quick actions', async () => {
    const mockProcessTask = require('../lib/aiAssistant').aiAssistant.processTask;
    mockProcessTask.mockResolvedValue({
      success: true,
      task: { id: 1, title: 'Test Task', status: 'processed' }
    });

    render(<AIAssistant />);
    
    // Open AI Assistant and switch to process mode
    const aiButton = screen.getByText('AI Assistant');
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      const processButton = screen.getByText('📋 Process');
      fireEvent.click(processButton);
    });
    
    await waitFor(() => {
      const todayButton = screen.getByText('Today');
      fireEvent.click(todayButton);
    });
    
    await waitFor(() => {
      expect(mockProcessTask).toHaveBeenCalledWith(expect.any(Number), expect.any(Object));
    });
  });
});
