import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug = () => {
  const { user, loading } = useAuth();

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', background: 'white', padding: '10px', border: '1px solid black', zIndex: 9999 }}>
      <h3>Auth Debug</h3>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>User: {user ? 'Yes' : 'No'}</p>
      {user && <p>Email: {user.email}</p>}
    </div>
  );
};

export default AuthDebug;
