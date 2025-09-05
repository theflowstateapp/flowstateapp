import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Heart,
  Smile,
  Frown,
  Meh,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Edit,
  Trash2,
  X,
  Target,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const Journal = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      title: 'Productive Day at Work',
      content: 'Today was incredibly productive! I completed the major project milestone ahead of schedule and received great feedback from the team. The morning routine really helped me stay focused throughout the day.',
      mood: 'happy',
      tags: ['work', 'productivity', 'success'],
      date: '2024-05-07',
      time: '18:30',
      wordCount: 45,
      gratitude: ['Team collaboration', 'Meeting deadlines', 'Positive feedback'],
      goals: ['Continue morning routine', 'Maintain productivity streak'],
      insights: 'Morning routines significantly impact daily productivity'
    },
    {
      id: 2,
      title: 'Learning New Skills',
      content: 'Spent the evening learning React hooks and state management. It\'s fascinating how much more efficient the code becomes with proper state management. Need to practice more with real projects.',
      mood: 'excited',
      tags: ['learning', 'coding', 'react'],
      date: '2024-05-06',
      time: '21:15',
      wordCount: 38,
      gratitude: ['Online learning resources', 'Supportive community', 'Progress in skills'],
      goals: ['Build a React project', 'Master state management'],
      insights: 'Consistent learning leads to skill development'
    },
    {
      id: 3,
      title: 'Challenging Day',
      content: 'Faced some difficult decisions today. The project requirements changed last minute, and I had to adapt quickly. While stressful, I learned that flexibility is key in project management.',
      mood: 'neutral',
      tags: ['challenge', 'adaptation', 'growth'],
      date: '2024-05-05',
      time: '19:45',
      wordCount: 42,
      gratitude: ['Team support', 'Problem-solving skills', 'Growth opportunities'],
      goals: ['Improve adaptability', 'Better planning'],
      insights: 'Challenges often lead to personal growth'
    },
    {
      id: 4,
      title: 'Weekend Reflection',
      content: 'Had a wonderful weekend with family. We went hiking and enjoyed nature. It reminded me of the importance of work-life balance and spending quality time with loved ones.',
      mood: 'happy',
      tags: ['family', 'nature', 'balance'],
      date: '2024-05-04',
      time: '20:00',
      wordCount: 35,
      gratitude: ['Family time', 'Nature', 'Work-life balance'],
      goals: ['More outdoor activities', 'Regular family time'],
      insights: 'Balance is essential for overall well-being'
    }
  ]);

  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showEditEntry, setShowEditEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'happy',
    tags: [],
    gratitude: ['', '', ''],
    goals: ['', ''],
    insights: ''
  });

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!newEntry.title || !newEntry.content) {
      toast.error('Please fill in title and content');
      return;
    }

    const entry = {
      id: Date.now(),
      ...newEntry,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      wordCount: newEntry.content.split(' ').length,
      tags: newEntry.tags.filter(tag => tag.trim() !== ''),
      gratitude: newEntry.gratitude.filter(item => item.trim() !== ''),
      goals: newEntry.goals.filter(goal => goal.trim() !== ''),
      insights: newEntry.insights.trim()
    };

    setEntries([entry, ...entries]);
    setNewEntry({
      title: '',
      content: '',
      mood: 'happy',
      tags: [],
      gratitude: ['', '', ''],
      goals: ['', ''],
      insights: ''
    });
    setShowAddEntry(false);
    toast.success('Journal entry added successfully!');
  };

  const handleEditEntry = (e) => {
    e.preventDefault();
    if (!newEntry.title || !newEntry.content) {
      toast.error('Please fill in title and content');
      return;
    }

    const updatedEntry = {
      ...selectedEntry,
      ...newEntry,
      wordCount: newEntry.content.split(' ').length,
      tags: newEntry.tags.filter(tag => tag.trim() !== ''),
      gratitude: newEntry.gratitude.filter(item => item.trim() !== ''),
      goals: newEntry.goals.filter(goal => goal.trim() !== ''),
      insights: newEntry.insights.trim()
    };

    setEntries(entries.map(entry => entry.id === selectedEntry.id ? updatedEntry : entry));
    setShowEditEntry(false);
    setSelectedEntry(null);
    toast.success('Journal entry updated successfully!');
  };

  const handleDeleteEntry = (entryId) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
    toast.success('Journal entry deleted successfully!');
  };

  const handleEditClick = (entry) => {
    setSelectedEntry(entry);
    setNewEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: [...entry.tags],
      gratitude: [...entry.gratitude, '', '', ''].slice(0, 3),
      goals: [...entry.goals, '', ''].slice(0, 2),
      insights: entry.insights
    });
    setShowEditEntry(true);
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'happy': return <Smile size={20} className="text-success-600" />;
      case 'excited': return <Heart size={20} className="text-danger-600" />;
      case 'neutral': return <Meh size={20} className="text-warning-600" />;
      case 'sad': return <Frown size={20} className="text-gray-600" />;
      default: return <Smile size={20} className="text-success-600" />;
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy': return 'bg-success-100 text-success-700';
      case 'excited': return 'bg-danger-100 text-danger-700';
      case 'neutral': return 'bg-warning-100 text-warning-700';
      case 'sad': return 'bg-gray-100 text-gray-700';
      default: return 'bg-success-100 text-success-700';
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesFilter = filter === 'all' || entry.mood === filter;
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const moodStats = {
    happy: entries.filter(e => e.mood === 'happy').length,
    excited: entries.filter(e => e.mood === 'excited').length,
    neutral: entries.filter(e => e.mood === 'neutral').length,
    sad: entries.filter(e => e.mood === 'sad').length
  };

  const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
  const averageWords = Math.round(totalWords / entries.length);

  const MetricCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {change && (
          <div className="flex items-center space-x-1">
            {change >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-success-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-danger-600" />
            )}
            <span className={`text-sm font-medium ${change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );

  const EntryCard = ({ entry }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
            {getMoodIcon(entry.mood)}
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
              {entry.mood}
            </span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{new Date(entry.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock size={12} />
              <span>{entry.time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditClick(entry)}
            className="p-2 text-gray-400 hover:text-primary-600"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteEntry(entry.id)}
            className="p-2 text-gray-400 hover:text-danger-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        <p className="text-gray-700 line-clamp-3">{entry.content}</p>
      </div>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{entry.wordCount} words</span>
          {entry.gratitude.length > 0 && (
            <span>{entry.gratitude.length} gratitude items</span>
          )}
          {entry.goals.length > 0 && (
            <span>{entry.goals.length} goals</span>
          )}
        </div>
        <button
          onClick={() => setSelectedEntry(entry)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View Full Entry
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal & Reflection</h1>
          <p className="text-gray-600 mt-1">Capture your thoughts, track your mood, and reflect on your journey</p>
        </div>
        <button
          onClick={() => setShowAddEntry(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Entry</span>
        </button>
      </div>

      {/* Journal Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Entries"
          value={entries.length}
          change={15.3}
          icon={BookOpen}
          color="bg-primary-500"
          subtitle="This month"
        />
        <MetricCard
          title="Average Words"
          value={averageWords}
          change={8.7}
          icon={Target}
          color="bg-success-500"
          subtitle="Per entry"
        />
        <MetricCard
          title="Positive Mood"
          value={moodStats.happy + moodStats.excited}
          change={12.5}
          icon={Heart}
          color="bg-danger-500"
          subtitle="Happy & excited"
        />
        <MetricCard
          title="Writing Streak"
          value="7"
          change={25.0}
          icon={Zap}
          color="bg-warning-500"
          subtitle="Days in a row"
        />
      </div>

      {/* Mood Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mood Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-success-100 mx-auto mb-3 flex items-center justify-center">
              <Smile className="h-8 w-8 text-success-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Happy</h3>
            <p className="text-2xl font-bold text-gray-900">{moodStats.happy}</p>
            <p className="text-sm text-gray-500">entries</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-danger-100 mx-auto mb-3 flex items-center justify-center">
              <Heart className="h-8 w-8 text-danger-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Excited</h3>
            <p className="text-2xl font-bold text-gray-900">{moodStats.excited}</p>
            <p className="text-sm text-gray-500">entries</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-warning-100 mx-auto mb-3 flex items-center justify-center">
              <Meh className="h-8 w-8 text-warning-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Neutral</h3>
            <p className="text-2xl font-bold text-gray-900">{moodStats.neutral}</p>
            <p className="text-sm text-gray-500">entries</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center">
              <Frown className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Sad</h3>
            <p className="text-2xl font-bold text-gray-900">{moodStats.sad}</p>
            <p className="text-sm text-gray-500">entries</p>
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Journal Entries</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Moods</option>
              <option value="happy">Happy</option>
              <option value="excited">Excited</option>
              <option value="neutral">Neutral</option>
              <option value="sad">Sad</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">New Journal Entry</h2>
              <button
                onClick={() => setShowAddEntry(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="input-field"
                  placeholder="What's on your mind today?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  className="input-field"
                  rows={6}
                  placeholder="Write about your day, thoughts, feelings..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                  <select
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                    className="input-field"
                  >
                    <option value="happy">Happy</option>
                    <option value="excited">Excited</option>
                    <option value="neutral">Neutral</option>
                    <option value="sad">Sad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newEntry.tags.join(', ')}
                    onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                    className="input-field"
                    placeholder="work, productivity, learning"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gratitude (3 things)</label>
                <div className="space-y-2">
                  {newEntry.gratitude.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updatedGratitude = [...newEntry.gratitude];
                        updatedGratitude[index] = e.target.value;
                        setNewEntry({ ...newEntry, gratitude: updatedGratitude });
                      }}
                      className="input-field"
                      placeholder={`Grateful for... (${index + 1})`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goals (2 things)</label>
                <div className="space-y-2">
                  {newEntry.goals.map((goal, index) => (
                    <input
                      key={index}
                      type="text"
                      value={goal}
                      onChange={(e) => {
                        const updatedGoals = [...newEntry.goals];
                        updatedGoals[index] = e.target.value;
                        setNewEntry({ ...newEntry, goals: updatedGoals });
                      }}
                      className="input-field"
                      placeholder={`Goal ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Insight</label>
                <textarea
                  value={newEntry.insights}
                  onChange={(e) => setNewEntry({ ...newEntry, insights: e.target.value })}
                  className="input-field"
                  rows={2}
                  placeholder="What did you learn today?"
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEntry(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {showEditEntry && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Edit Journal Entry</h2>
              <button
                onClick={() => {
                  setShowEditEntry(false);
                  setSelectedEntry(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="input-field"
                  placeholder="What's on your mind today?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  className="input-field"
                  rows={6}
                  placeholder="Write about your day, thoughts, feelings..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                  <select
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                    className="input-field"
                  >
                    <option value="happy">Happy</option>
                    <option value="excited">Excited</option>
                    <option value="neutral">Neutral</option>
                    <option value="sad">Sad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newEntry.tags.join(', ')}
                    onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                    className="input-field"
                    placeholder="work, productivity, learning"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gratitude (3 things)</label>
                <div className="space-y-2">
                  {newEntry.gratitude.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updatedGratitude = [...newEntry.gratitude];
                        updatedGratitude[index] = e.target.value;
                        setNewEntry({ ...newEntry, gratitude: updatedGratitude });
                      }}
                      className="input-field"
                      placeholder={`Grateful for... (${index + 1})`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goals (2 things)</label>
                <div className="space-y-2">
                  {newEntry.goals.map((goal, index) => (
                    <input
                      key={index}
                      type="text"
                      value={goal}
                      onChange={(e) => {
                        const updatedGoals = [...newEntry.goals];
                        updatedGoals[index] = e.target.value;
                        setNewEntry({ ...newEntry, goals: updatedGoals });
                      }}
                      className="input-field"
                      placeholder={`Goal ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Insight</label>
                <textarea
                  value={newEntry.insights}
                  onChange={(e) => setNewEntry({ ...newEntry, insights: e.target.value })}
                  className="input-field"
                  rows={2}
                  placeholder="What did you learn today?"
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Update Entry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditEntry(false);
                    setSelectedEntry(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
