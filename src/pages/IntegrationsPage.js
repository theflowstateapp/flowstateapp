import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Mail,
  CheckSquare,
  Apple,
  Settings,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Users,
  BarChart3,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch integrations on component mount
  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/integrations/list');
      const data = await response.json();
      
      if (data.success) {
        setIntegrations(data.integrations);
      } else {
        setError('Failed to fetch integrations');
      }
    } catch (err) {
      setError('Error connecting to backend server');
      console.error('Error fetching integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const connectIntegration = async (integrationId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/integrations/connect/${integrationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current-user' // In real app, get from auth context
        })
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.authUrl) {
          // Open OAuth URL in new window
          window.open(data.authUrl, '_blank', 'width=600,height=600');
        } else {
          // Direct connection (like Apple Reminders)
          if (integrationId === 'apple-reminders' && data.mockData) {
            const remindersCount = data.mockData.remindersCount;
            alert(`${data.message}\n\nImported ${remindersCount} reminders successfully!`);
          } else {
            alert(data.message);
          }
          fetchIntegrations(); // Refresh the list
        }
      } else {
        alert(`Failed to connect: ${data.error}`);
      }
    } catch (err) {
      console.error('Error connecting integration:', err);
      alert('Error connecting integration');
    }
  };

  const disconnectIntegration = async (integrationId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/integrations/disconnect/${integrationId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        fetchIntegrations(); // Refresh the list
      } else {
        alert(`Failed to disconnect: ${data.error}`);
      }
    } catch (err) {
      console.error('Error disconnecting integration:', err);
      alert('Error disconnecting integration');
    }
  };

  const syncIntegration = async (integrationId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/integrations/sync/${integrationId}`, {
        method: 'POST'
      });

      const data = await response.json();
      
      if (data.success) {
        if (integrationId === 'apple-reminders') {
          alert(`${data.message}\n\nSynced ${data.itemsSynced} reminders successfully!`);
        } else {
          alert(`${data.message}\nItems synced: ${data.itemsSynced}`);
        }
      } else {
        alert(`Failed to sync: ${data.error}`);
      }
    } catch (err) {
      console.error('Error syncing integration:', err);
      alert('Error syncing integration');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'setup_required':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'unavailable':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'setup_required':
        return 'Setup Required';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'setup_required':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntegrationIcon = (id) => {
    switch (id) {
      case 'google-calendar':
        return <Calendar className="w-8 h-8 text-blue-500" />;
      case 'apple-reminders':
        return <Apple className="w-8 h-8 text-gray-600" />;
      case 'todoist':
        return <CheckSquare className="w-8 h-8 text-red-500" />;
      case 'gmail':
        return <Mail className="w-8 h-8 text-green-500" />;
      default:
        return <Settings className="w-8 h-8 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading integrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchIntegrations}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
              <p className="text-gray-600">Connect your favorite productivity tools</p>
            </div>
            <button
              onClick={fetchIntegrations}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Integrations</p>
                <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Connected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Setup Required</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.filter(i => i.status === 'setup_required').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Sync</p>
                <p className="text-sm font-bold text-gray-900">2 min ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getIntegrationIcon(integration.id)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {getStatusText(integration.status)}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {integration.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {integration.status === 'connected' ? (
                    <>
                      <button
                        onClick={() => syncIntegration(integration.id)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Sync</span>
                      </button>
                      <button
                        onClick={() => disconnectIntegration(integration.id)}
                        className="flex items-center justify-center bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : integration.status === 'setup_required' ? (
                    <button
                      onClick={() => connectIntegration(integration.id)}
                      className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Setup</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full flex items-center justify-center space-x-2 bg-gray-300 text-gray-500 px-3 py-2 rounded-lg cursor-not-allowed text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Unavailable</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setSelectedIntegration(integration);
                      setShowDetails(true);
                    }}
                    className="flex items-center justify-center bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {integrations.length === 0 && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations available</h3>
            <p className="text-gray-600">Check your backend server configuration.</p>
          </div>
        )}
      </div>

      {/* Integration Details Modal */}
      <AnimatePresence>
        {showDetails && selectedIntegration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getIntegrationIcon(selectedIntegration.id)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedIntegration.name}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedIntegration.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Status:</p>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedIntegration.status)}`}>
                    {getStatusIcon(selectedIntegration.status)}
                    <span>{getStatusText(selectedIntegration.status)}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedIntegration.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedIntegration.setupRequired && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Setup Required:</strong> This integration requires additional configuration in your backend environment variables.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {selectedIntegration.status === 'setup_required' && (
                  <button
                    onClick={() => {
                      connectIntegration(selectedIntegration.id);
                      setShowDetails(false);
                    }}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Setup
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegrationsPage;