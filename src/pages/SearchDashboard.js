import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  Clock,
  TrendingUp,
  Tag,
  FileText,
  Target,
  Users,
  Calendar,
  Star,
  ArrowRight,
  Download,
  Share2,
  Bookmark,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import { AdvancedSearch } from '../lib/advancedSearch';

const SearchDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    entities: ['tasks', 'projects', 'notes'],
    status: 'all',
    priority: 'all',
    type: 'all',
    dateRange: { startDate: '', endDate: '' },
    tags: []
  });

  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Focus search input on mount
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Debounced search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch();
      }, 300);
    } else {
      setSearchResults(null);
      setSuggestions([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, filters]);

  useEffect(() => {
    // Get search suggestions
    if (searchQuery.length >= 2) {
      const newSuggestions = AdvancedSearch.getSearchSuggestions(searchQuery);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    try {
      const results = AdvancedSearch.searchAll(searchQuery, filters.entities);
      
      // Apply additional filters
      if (filters.status !== 'all') {
        results.tasks = results.tasks.filter(task => task.status === filters.status);
        results.projects = results.projects.filter(project => project.status === filters.status);
      }

      if (filters.priority !== 'all') {
        results.tasks = results.tasks.filter(task => task.priority === filters.priority);
      }

      if (filters.type !== 'all') {
        results.tasks = results.tasks.filter(task => task.type === filters.type);
        results.projects = results.projects.filter(project => project.type === filters.type);
      }

      if (filters.tags.length > 0) {
        results.tasks = results.tasks.filter(task => 
          task.tags && filters.tags.some(tag => task.tags.includes(tag))
        );
        results.projects = results.projects.filter(project => 
          project.tags && filters.tags.some(tag => project.tags.includes(tag))
        );
      }

      setSearchResults(results);
      
      // Save search history
      AdvancedSearch.saveSearchHistory(searchQuery, results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setSuggestions([]);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const getFilterOptions = () => {
    return AdvancedSearch.getFilterOptions('tasks');
  };

  const renderSearchResult = (item, type) => {
    const getIcon = () => {
      switch (type) {
        case 'task':
          return <CheckCircle className="w-5 h-5 text-blue-600" />;
        case 'project':
          return <Target className="w-5 h-5 text-green-600" />;
        case 'note':
          return <FileText className="w-5 h-5 text-purple-600" />;
        default:
          return <Info className="w-5 h-5 text-gray-600" />;
      }
    };

    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'completed':
        case 'done':
          return 'bg-green-100 text-green-800';
        case 'in progress':
        case 'active':
          return 'bg-blue-100 text-blue-800';
        case 'pending':
        case 'not started':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {item.title || item.name}
              </h3>
              <div className="flex items-center space-x-2">
                {item.status && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                )}
                {item.priority && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                    item.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.priority}
                  </span>
                )}
              </div>
            </div>
            
            {item.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {item.type && (
                <span className="flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <span>{item.type}</span>
                </span>
              )}
              {item.assignee && (
                <span className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{item.assignee}</span>
                </span>
              )}
              {item.dueDate && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                </span>
              )}
            </div>
            
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{item.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const tabs = [
    { id: 'all', name: 'All Results', count: searchResults?.total || 0 },
    { id: 'tasks', name: 'Tasks', count: searchResults?.tasks?.length || 0 },
    { id: 'projects', name: 'Projects', count: searchResults?.projects?.length || 0 },
    { id: 'notes', name: 'Notes', count: searchResults?.notes?.length || 0 }
  ];

  const getCurrentResults = () => {
    if (!searchResults) return [];
    
    switch (activeTab) {
      case 'tasks':
        return searchResults.tasks;
      case 'projects':
        return searchResults.projects;
      case 'notes':
        return searchResults.notes;
      default:
        return [
          ...searchResults.tasks.map(item => ({ ...item, _type: 'task' })),
          ...searchResults.projects.map(item => ({ ...item, _type: 'project' })),
          ...searchResults.notes.map(item => ({ ...item, _type: 'note' }))
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Everything</h1>
          <p className="text-gray-600 text-lg">Find tasks, projects, notes, and more across your Life OS</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything..."
              className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    {suggestion.type === 'recent' && <Clock className="w-4 h-4 text-gray-400" />}
                    {suggestion.type === 'popular' && <TrendingUp className="w-4 h-4 text-gray-400" />}
                    {suggestion.type === 'tag' && <Tag className="w-4 h-4 text-gray-400" />}
                    <span className="text-gray-700">{suggestion.text}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="Task">Task</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Project">Project</option>
                    <option value="Note">Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={filters.dateRange.startDate}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, startDate: e.target.value }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.endDate}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, endDate: e.target.value }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {tab.name} ({tab.count})
                  </button>
                ))}
              </div>

              {isSearching && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Searching...</span>
                </div>
              )}
            </div>

            {/* Results */}
            {searchResults && (
              <div className="space-y-4">
                {getCurrentResults().length > 0 ? (
                  getCurrentResults().map((item, index) => (
                    <div key={`${item.id || index}-${item._type || 'item'}`}>
                      {renderSearchResult(item, item._type)}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">Try adjusting your search terms or filters</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Search Tips */}
        {!searchQuery && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• Search by title, description, or tags</p>
                <p className="text-sm text-gray-600">• Use quotes for exact phrases</p>
                <p className="text-sm text-gray-600">• Filter by status, priority, or type</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• Search across tasks, projects, and notes</p>
                <p className="text-sm text-gray-600">• Use date ranges to find recent items</p>
                <p className="text-sm text-gray-600">• Click on suggestions for quick access</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDashboard;
