import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  Mail,
  Video,
  BookOpen,
  Tag,
  Plus,
  Send,
  ArrowRight,
  Filter,
  SortAsc,
  ThumbsUp,
  ThumbsDown,
  Eye,
  X,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Help = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: '',
    attachments: []
  });
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      subject: 'Unable to sync Apple Reminders',
      category: 'integration',
      priority: 'high',
      status: 'open',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      description: 'I\'m having trouble syncing my Apple Reminders with FlowState. The connection keeps failing.',
      responses: [
        {
          id: 'RESP-001',
          type: 'support',
          message: 'Thank you for contacting us. We\'re looking into this issue and will get back to you within 24 hours.',
          createdAt: '2024-01-15T10:30:00Z',
          author: 'Support Team'
        }
      ]
    },
    {
      id: 'TKT-002',
      subject: 'Feature request: Dark mode improvements',
      category: 'feature',
      priority: 'low',
      status: 'in-progress',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-16',
      description: 'Would love to see more customization options for dark mode, especially for the sidebar.',
      responses: [
        {
          id: 'RESP-002',
          type: 'support',
          message: 'Great suggestion! We\'ve added this to our roadmap for Q2 2024.',
          createdAt: '2024-01-16T14:20:00Z',
          author: 'Product Team'
        }
      ]
    },
    {
      id: 'TKT-003',
      subject: 'Bug: Tasks not saving properly',
      category: 'bug',
      priority: 'high',
      status: 'resolved',
      createdAt: '2024-01-13',
      updatedAt: '2024-01-15',
      description: 'Sometimes when I create a new task, it doesn\'t save and disappears when I refresh the page.',
      responses: [
        {
          id: 'RESP-003',
          type: 'support',
          message: 'This issue has been identified and fixed in version 2.1.3. Please update your app.',
          createdAt: '2024-01-15T09:15:00Z',
          author: 'Engineering Team'
        }
      ]
    }
  ]);

  const [faqItems] = useState([
    {
      id: 'faq-1',
      question: 'How do I sync my Apple Reminders with FlowState?',
      answer: 'To sync Apple Reminders, go to Settings > Integrations > Apple Reminders and click "Connect". You\'ll need to grant permission for FlowState to access your reminders. Once connected, you can import existing reminders and enable auto-sync.',
      category: 'integrations',
      helpful: 45
    },
    {
      id: 'faq-2',
      question: 'Can I use FlowState offline?',
      answer: 'Yes! FlowState works offline for most features. Your data syncs automatically when you\'re back online. Some AI features require an internet connection.',
      category: 'general',
      helpful: 38
    },
    {
      id: 'faq-3',
      question: 'How does the AI Assistant work?',
      answer: 'The AI Assistant uses advanced natural language processing to help you manage tasks, set goals, and provide insights. It can categorize items, suggest deadlines, and even help with productivity strategies.',
      category: 'ai',
      helpful: 52
    },
    {
      id: 'faq-4',
      question: 'Is my data secure and private?',
      answer: 'Absolutely. We use end-to-end encryption and never share your personal data. All data is stored securely and you can export or delete it at any time.',
      category: 'privacy',
      helpful: 41
    },
    {
      id: 'faq-5',
      question: 'How do I backup my data?',
      answer: 'Go to Settings > Data & Export to enable automatic backups. You can also manually export your data in JSON format at any time.',
      category: 'data',
      helpful: 29
    },
    {
      id: 'faq-6',
      question: 'Can I customize the interface?',
      answer: 'Yes! You can customize themes, colors, fonts, and layout in Settings > Appearance. We also support dark mode and compact views.',
      category: 'customization',
      helpful: 33
    }
  ]);

  const [knowledgeBase] = useState([
    {
      id: 'kb-1',
      title: 'Getting Started with FlowState',
      category: 'getting-started',
      content: 'Complete guide to setting up and using FlowState effectively.',
      lastUpdated: '2024-01-10',
      views: 1250
    },
    {
      id: 'kb-2',
      title: 'P.A.R.A. Method Implementation',
      category: 'methodology',
      content: 'Learn how to implement the P.A.R.A. productivity method in FlowState.',
      lastUpdated: '2024-01-08',
      views: 890
    },
    {
      id: 'kb-3',
      title: 'AI Assistant Best Practices',
      category: 'ai',
      content: 'Tips and tricks for getting the most out of your AI Assistant.',
      lastUpdated: '2024-01-12',
      views: 650
    },
    {
      id: 'kb-4',
      title: 'Integration Setup Guide',
      category: 'integrations',
      content: 'Step-by-step guides for setting up all supported integrations.',
      lastUpdated: '2024-01-14',
      views: 420
    },
    {
      id: 'kb-5',
      title: 'Troubleshooting Common Issues',
      category: 'troubleshooting',
      content: 'Solutions to the most common problems users encounter.',
      lastUpdated: '2024-01-11',
      views: 780
    }
  ]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'faq', name: 'FAQ', icon: HelpCircle },
    { id: 'knowledge', name: 'Knowledge Base', icon: BookOpen },
    { id: 'tickets', name: 'Support Tickets', icon: MessageSquare },
    { id: 'contact', name: 'Contact Us', icon: Phone }
  ];

  const handleCreateTicket = () => {
    if (!ticketForm.subject || !ticketForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      description: ticketForm.description,
      responses: []
    };

    setTickets([newTicket, ...tickets]);
    setTicketForm({
      subject: '',
      category: 'general',
      priority: 'medium',
      description: '',
      attachments: []
    });
    setShowTicketModal(false);
    toast.success('Support ticket created successfully!');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50';
      case 'in-progress': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'closed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredKB = knowledgeBase.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-1">Get help, find answers, and contact our support team</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTicketModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search help articles, FAQ, or knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <tab.icon size={16} />
                <span>{tab.name}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Knowledge Base</h3>
                </div>
                <p className="text-gray-600 mb-4">Browse our comprehensive guides and tutorials</p>
                <button
                  onClick={() => setActiveTab('knowledge')}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                >
                  <span>Browse Articles</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <HelpCircle className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">FAQ</h3>
                </div>
                <p className="text-gray-600 mb-4">Find quick answers to common questions</p>
                <button
                  onClick={() => setActiveTab('faq')}
                  className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
                >
                  <span>View FAQ</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Support</h3>
                </div>
                <p className="text-gray-600 mb-4">Get help from our support team</p>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
                >
                  <span>Contact Support</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Support Activity</h3>
              <div className="space-y-4">
                {tickets.slice(0, 3).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageSquare className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                        <p className="text-sm text-gray-600">Ticket #{ticket.id} • {ticket.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-400" />
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="all">All Categories</option>
                  <option value="general">General</option>
                  <option value="integrations">Integrations</option>
                  <option value="ai">AI Features</option>
                  <option value="privacy">Privacy & Security</option>
                  <option value="data">Data Management</option>
                  <option value="customization">Customization</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredFAQ.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-gray-600 mb-4">{item.answer}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Tag size={16} />
                          <span>{item.category}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsUp size={16} />
                          <span>{item.helpful} found this helpful</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                        <ThumbsUp size={20} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <ThumbsDown size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
              <div className="flex items-center space-x-2">
                <SortAsc size={20} className="text-gray-400" />
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKB.map((article) => (
                <div key={article.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="text-blue-600" size={20} />
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Updated {article.lastUpdated}</span>
                    <span className="flex items-center space-x-1">
                      <Eye size={16} />
                      <span>{article.views} views</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
              <button
                onClick={() => setShowTicketModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>New Ticket</span>
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                            <div className="text-sm text-gray-500">#{ticket.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {ticket.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-gray-600 hover:text-gray-900">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Support</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MessageSquare className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Live Chat</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Get instant help from our support team</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Start Chat
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Mail className="text-green-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Send us an email and we'll respond within 24 hours</p>
                  <a href="mailto:support@flowstate.com" className="text-green-600 hover:text-green-700 font-medium">
                    support@flowstate.com
                  </a>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Phone className="text-purple-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Phone Support</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Call us for urgent issues</p>
                  <p className="text-purple-600 font-medium">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500 mt-1">Mon-Fri 9AM-6PM PST</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Video className="text-yellow-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Video Call</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Schedule a screen sharing session</p>
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                    Schedule Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Creation Modal */}
      <AnimatePresence>
        {showTicketModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create Support Ticket</h3>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="integration">Integration Issue</option>
                      <option value="billing">Billing</option>
                      <option value="account">Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide detailed information about your issue..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTicket}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Create Ticket</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Help;
