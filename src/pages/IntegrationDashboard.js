import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const IntegrationDashboard = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState([]);
  const [syncHistory, setSyncHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  useEffect(() => {
    fetchIntegrationData();
  }, []);

  const fetchIntegrationData = async () => {
    try {
      setLoading(true);
      
      // Fetch integrations
      const integrationsResponse = await fetch(`/api/integrations/list?userId=${user?.id}`);
      const integrationsData = await integrationsResponse.json();
      
      if (integrationsData.success) {
        setIntegrations(integrationsData.integrations);
      }

      // Fetch sync history for connected integrations
      const connectedIntegrations = integrationsData.integrations.filter(i => i.isConnected);
      const historyPromises = connectedIntegrations.map(async (integration) => {
        try {
          const response = await fetch(`/api/sync/${integration.provider}/history?userId=${user?.id}`);
          const data = await response.json();
          return data.success ? data.history : [];
        } catch (err) {
          return [];
        }
      });

      const historyResults = await Promise.all(historyPromises);
      const allHistory = historyResults.flat();
      setSyncHistory(allHistory.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)));

    } catch (err) {
      setError('Failed to fetch integration data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading integration dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Integration Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor your connected integrations and sync status.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Connected Integrations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Connected Integrations</h2>
              </div>
              <div className="p-6">
                {integrations.filter(i => i.isConnected).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">🔗</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations connected</h3>
                    <p className="text-gray-500 mb-4">Connect your first integration to get started.</p>
                    <button
                      onClick={() => window.location.href = '/integrations'}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      Browse Integrations
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {integrations.filter(i => i.isConnected).map((integration) => (
                      <div
                        key={integration.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{integration.icon}</div>
                            <div>
                              <h3 className="font-medium text-gray-900">{integration.name}</h3>
                              <p className="text-sm text-gray-500">Last sync: {integration.lastSyncAt || 'Never'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Connected
                            </span>
                            <button
                              onClick={() => setSelectedIntegration(integration)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sync History */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Sync History</h2>
              </div>
              <div className="p-6">
                {syncHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sync history</h3>
                    <p className="text-gray-500">Sync history will appear here once you start syncing integrations.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {syncHistory.slice(0, 10).map((sync, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            sync.status === 'completed' ? 'bg-green-500' :
                            sync.status === 'running' ? 'bg-blue-500' :
                            sync.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{sync.provider}</p>
                            <p className="text-sm text-gray-500">
                              {sync.syncType} sync • {formatDate(sync.startedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sync.status)}`}>
                            {sync.status}
                          </span>
                          {sync.durationMs && (
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDuration(sync.durationMs)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Integration Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Connected:</span>
                  <span className="font-medium text-gray-900">
                    {integrations.filter(i => i.isConnected).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium text-gray-900">
                    {integrations.filter(i => !i.isConnected).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Syncs:</span>
                  <span className="font-medium text-gray-900">
                    {syncHistory.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium text-gray-900">
                    {syncHistory.length > 0 
                      ? `${Math.round((syncHistory.filter(s => s.status === 'completed').length / syncHistory.length) * 100)}%`
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/integrations'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Integration
                </button>
                <button
                  onClick={fetchIntegrationData}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Integration Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sync Engine:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Check:</span>
                  <span className="text-sm text-gray-900">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Detail Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedIntegration.name} Details
                  </h3>
                  <button
                    onClick={() => setSelectedIntegration(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedIntegration.provider}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connected
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Sync</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedIntegration.lastSyncAt || 'Never'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedIntegration.description}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => {
                      // Trigger sync
                      setSelectedIntegration(null);
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Sync Now
                  </button>
                  <button
                    onClick={() => setSelectedIntegration(null)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationDashboard;



