import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './lib/errorHandler';
import { logger } from './lib/logger';
import performanceMonitor from './utils/performanceMonitor';
import { initAnalytics, trackPageView } from './utils/analytics';
import { initSEO } from './utils/seo';
import { initSecurity } from './utils/security';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import AppLayout from './components/AppLayout';
import TestPage from './pages/TestPage';

function App() {
  // Initialize logging, performance monitoring, analytics, SEO, and security
  React.useEffect(() => {
    logger.info('APP', 'Flow State application started', {
      version: process.env.REACT_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

    // Initialize performance monitoring
    performanceMonitor.init();
    
    // Initialize analytics
    initAnalytics();
    
    // Initialize SEO
    initSEO();
    
    // Initialize security measures
    initSecurity();
    
    // Report app startup performance
    setTimeout(() => {
      const metrics = performanceMonitor.getMetrics();
      logger.info('PERFORMANCE', 'App startup metrics', metrics);
    }, 2000);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/demo" element={<AppLayout />} />
          <Route path="/demo/*" element={<AppLayout />} />
          <Route path="/dashboard" element={<AppLayout />} />
          <Route path="/dashboard/*" element={<AppLayout />} />
          <Route path="/shutdown" element={<AppLayout />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
