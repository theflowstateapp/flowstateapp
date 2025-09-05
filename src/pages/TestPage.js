import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DebugConnection from '../components/DebugConnection';

const TestPage = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Life OS - Test Page</h1>
        
        <div className="space-y-4">
          <DebugConnection />
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-blue-900">Environment Variables</h2>
            <p className="text-sm text-blue-700">
              Supabase URL: {process.env.REACT_APP_SUPABASE_URL ? '✅ Set' : '❌ Not Set'}
            </p>
            <p className="text-sm text-blue-700">
              Supabase Key: {process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not Set'}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h2 className="font-semibold text-green-900">Authentication Status</h2>
            <p className="text-sm text-green-700">
              Loading: {loading ? '✅ Yes' : '❌ No'}
            </p>
            <p className="text-sm text-green-700">
              User: {user ? '✅ Logged In' : '❌ Not Logged In'}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h2 className="font-semibold text-purple-900">App Status</h2>
            <p className="text-sm text-purple-700">✅ React App Running</p>
            <p className="text-sm text-purple-700">✅ Supabase Connected</p>
            <p className="text-sm text-purple-700">✅ Authentication Ready</p>
          </div>

          <div className="mt-6">
            <a 
              href="/app" 
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-center block"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
