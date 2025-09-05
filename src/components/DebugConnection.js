import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

const DebugConnection = () => {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Connecting to Supabase...');
        
        // Test basic connection
        const { error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error) {
          setError(error.message);
          setStatus('Connection failed');
        } else {
          setStatus('Connection successful!');
        }
      } catch (err) {
        setError(err.message);
        setStatus('Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-semibold mb-2">Supabase Connection Test</h3>
      <p className="text-sm mb-2">Status: {status}</p>
      {error && (
        <div className="text-red-600 text-sm">
          Error: {error}
        </div>
      )}
      <div className="text-xs text-gray-600 mt-2">
        <p>URL: {process.env.REACT_APP_SUPABASE_URL ? 'Set' : 'Not set'}</p>
        <p>Key: {process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Present' : 'Missing'}</p>
      </div>
    </div>
  );
};

export default DebugConnection;
