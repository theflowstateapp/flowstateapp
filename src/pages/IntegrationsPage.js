import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const IntegrationsPage = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/integrations/list?userId=${user?.id}`);
      const data = await response.json();
      
      if (data.success) {
        setIntegrations(data.integrations);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch integrations');
    } finally {
      setLoading(false);
    }
  };

  const connectIntegration = async (provider) => {
    try {
      setConnecting(provider);
      
      // Redirect to OAuth flow
      window.location.href = `/api/auth/${provider}/login`;
    } catch (err) {
      setError(`Failed to connect ${provider}`);
      setConnecting(null);
    }
  };

  const disconnectIntegration = async (provider) => {
    try {
      const response = await fetch(`/api/integrations/${provider}/disconnect`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      const data = await response.json();
      
      if (data.success) {
        fetchIntegrations(); // Refresh the list
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(`Failed to disconnect ${provider}`);
    }
  };

  const syncIntegration = async (provider) => {
    try {
      const response = await fetch(`/api/integrations/${provider}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user?.id,
          syncType: 'incremental'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Show success message
        // eslint-disable-next-line no-console
        console.log(`${provider} sync completed`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(`Failed to sync ${provider}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="mt-2 text-gray-600">
            Connect your favorite productivity tools to LifeOS for seamless workflow management.
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

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Integration Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{integration.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  integration.isConnected 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {integration.isConnected ? 'Connected' : 'Available'}
                </div>
              </div>

              {/* Integration Status */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${
                    integration.isConnected ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {integration.isConnected ? 'Active' : 'Not Connected'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {integration.isConnected ? (
                  <>
                    <button
                      onClick={() => syncIntegration(integration.provider)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Sync Now
                    </button>
                    <button
                      onClick={() => disconnectIntegration(integration.provider)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => connectIntegration(integration.provider)}
                    disabled={connecting === integration.provider}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {connecting === integration.provider ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connecting...
                      </div>
                    ) : (
                      'Connect'
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {integrations.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔗</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations available</h3>
            <p className="text-gray-500">Check back later for new integrations.</p>
          </div>
        )}

        {/* Integration Benefits */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Integrate?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">⏰</div>
              <h3 className="font-medium text-gray-900 mb-2">Save Time</h3>
              <p className="text-sm text-gray-600">
                Automate data sync between your favorite tools and eliminate manual work.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-medium text-gray-900 mb-2">Stay Focused</h3>
              <p className="text-sm text-gray-600">
                Manage everything from one central hub without switching between apps.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-medium text-gray-900 mb-2">Get Insights</h3>
              <p className="text-sm text-gray-600">
                AI-powered analysis across all your tools for better productivity insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
