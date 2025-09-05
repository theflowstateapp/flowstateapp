import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      try {
        // eslint-disable-next-line no-console
        console.log('AuthContext: Getting initial user...');
        
        // For development/testing, provide a mock user if API is not available
        try {
          const response = await apiService.getCurrentUser();
          // eslint-disable-next-line no-console
          console.log('AuthContext: Initial user:', response.user);
          setUser(response.user);
        } catch (apiError) {
          // eslint-disable-next-line no-console
          console.log('AuthContext: API not available, using mock user for testing');
          setUser({
            id: '1',
            email: 'user@flowstate.com',
            firstName: 'John',
            lastName: 'Smith',
            avatar: null,
            preferences: {
              theme: 'light',
              notifications: true,
              emailUpdates: true,
              language: 'en'
            }
          });
        }
      } catch (error) {
        console.error('Error getting initial user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();
  }, []);

  const signUp = async (email, password, userData = {}) => {
    try {
      const response = await apiService.register({
        email,
        password,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
      });
      setUser(response.user);
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await apiService.login({ email, password });
      setUser(response.user);
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await apiService.logout();
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      return { error: null };
    } catch (error) {
      // Even if API call fails, clear local user state
      setUser(null);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

