import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Check for demo mode
    const checkDemoMode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isDemoParam = urlParams.get('demo') === '1';
      const demoToken = urlParams.get('demoToken');
      const demoCookie = document.cookie.includes('demo=1');
      
      return isDemoParam || demoToken || demoCookie;
    };

    // Get initial user
    const getInitialUser = async () => {
      try {
        // eslint-disable-next-line no-console
        console.log('AuthContext: Getting initial user...');
        
        // Check if we're in demo mode
        const demoMode = checkDemoMode();
        setIsDemo(demoMode);
        
        if (demoMode) {
          // Handle demo token exchange if needed
          const urlParams = new URLSearchParams(window.location.search);
          const demoToken = urlParams.get('demoToken');
          
          if (demoToken && !document.cookie.includes('sb-access-token')) {
            try {
              const response = await fetch('/api/demo/exchange', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: demoToken }),
                credentials: 'include'
              });
              
              if (response.ok) {
                // Remove demo token from URL
                const newUrl = new URL(window.location);
                newUrl.searchParams.delete('demoToken');
                window.history.replaceState({}, '', newUrl);
                
                // Refresh the page to pick up new cookies
                window.location.reload();
                return;
              } else {
                console.error('Demo token exchange failed:', response.status);
              }
            } catch (error) {
              console.error('Demo token exchange failed:', error);
            }
          }
        }
        
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
            email: demoMode ? 'demo@theflowstateapp.com' : 'user@flowstate.com',
            firstName: demoMode ? 'Demo' : 'John',
            lastName: demoMode ? 'User' : 'Smith',
            avatar: null,
            preferences: {
              theme: 'light',
              notifications: true,
              emailUpdates: true,
              language: 'en',
              demo_mode: demoMode
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
    isDemo,
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

