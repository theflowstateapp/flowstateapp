// CQO Agent Task: QA Dashboard Component
// Real-time quality monitoring dashboard for LifeOS

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown,
  Activity, Shield, Eye, Zap, Users, BarChart3, RefreshCw,
  Download, Filter, Calendar, Clock, Target, Award
} from 'lucide-react';
import { qaManager } from '../lib/qaManager';

const QADashboard = () => {
  const [qaResults, setQaResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedBrowser, setSelectedBrowser] = useState('all');
  const [selectedViewport, setSelectedViewport] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Run QA tests
  const runQATests = async () => {
    setIsRunning(true);
    try {
      const results = await qaManager.runComprehensiveQA();
      setQaResults(results);
    } catch (error) {
      console.error('QA tests failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Auto refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(runQATests, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Get filtered results
  const getFilteredResults = () => {
    if (!qaResults) return null;

    let filtered = { ...qaResults.details };

    if (selectedBrowser !== 'all') {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([key]) => key.startsWith(selectedBrowser))
      );
    }

    if (selectedViewport !== 'all') {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([key]) => key.endsWith(selectedViewport))
      );
    }

    return { ...qaResults, details: filtered };
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  // Get score icon
  const getScoreIcon = (score) => {
    if (score >= 90) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 80) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  // Export results
  const exportResults = () => {
    if (!qaResults) return;
    
    const dataStr = JSON.stringify(qaResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qa-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredResults = getFilteredResults();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="mr-3 text-blue-600" size={32} />
                Quality Assurance Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Comprehensive quality monitoring for LifeOS</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <Activity className="w-4 h-4 mr-2 inline" />
                Auto Refresh
              </button>
              
              <button
                onClick={runQATests}
                disabled={isRunning}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isRunning ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isRunning ? 'Running Tests...' : 'Run QA Tests'}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {qaResults && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                value={selectedBrowser}
                onChange={(e) => setSelectedBrowser(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Browsers</option>
                <option value="chromium">Chromium</option>
                <option value="firefox">Firefox</option>
                <option value="webkit">WebKit</option>
              </select>
              
              <select
                value={selectedViewport}
                onChange={(e) => setSelectedViewport(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Viewports</option>
                <option value="desktop">Desktop</option>
                <option value="tablet">Tablet</option>
                <option value="mobile">Mobile</option>
              </select>
              
              <button
                onClick={exportResults}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {filteredResults && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredResults.summary.total}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Passed</p>
                  <p className="text-2xl font-bold text-green-600">{filteredResults.summary.passed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">{filteredResults.summary.warnings}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{filteredResults.summary.failed}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
        )}

        {/* Detailed Results */}
        {filteredResults && (
          <div className="space-y-6">
            {Object.entries(filteredResults.details).map(([browserViewport, results]) => (
              <motion.div
                key={browserViewport}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 capitalize">
                    {browserViewport.replace('_', ' ')}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(filteredResults.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {Object.entries(results).map(([testType, result]) => (
                    <div key={testType} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getScoreIcon(result.score)}
                          <span className="font-medium text-gray-900 capitalize">{testType}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </span>
                      </div>

                      <div className="space-y-2">
                        {testType === 'performance' && result.metrics && (
                          <div className="text-xs text-gray-600">
                            <div>Load: {result.metrics.loadTime?.toFixed(0)}ms</div>
                            <div>FCP: {result.metrics.firstContentfulPaint?.toFixed(0)}ms</div>
                            <div>LCP: {result.metrics.lcp?.toFixed(0)}ms</div>
                          </div>
                        )}

                        {testType === 'accessibility' && result.violations && (
                          <div className="text-xs text-gray-600">
                            <div>Violations: {result.violations.length}</div>
                            <div>Passes: {result.passes?.length || 0}</div>
                          </div>
                        )}

                        {testType === 'functionality' && result.tests && (
                          <div className="text-xs text-gray-600">
                            <div>Tests: {result.tests.length}</div>
                            <div>Passed: {result.tests.filter(t => t.passed).length}</div>
                          </div>
                        )}

                        {testType === 'security' && result.checks && (
                          <div className="text-xs text-gray-600">
                            <div>Checks: {result.checks.length}</div>
                            <div>Passed: {result.checks.filter(c => c.passed).length}</div>
                          </div>
                        )}

                        {testType === 'usability' && result.checks && (
                          <div className="text-xs text-gray-600">
                            <div>Checks: {result.checks.length}</div>
                            <div>Passed: {result.checks.filter(c => c.passed).length}</div>
                          </div>
                        )}
                      </div>

                      {result.issues && result.issues.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs font-medium text-red-600 mb-1">Issues:</div>
                          <div className="text-xs text-red-600 space-y-1">
                            {result.issues.slice(0, 2).map((issue, index) => (
                              <div key={index} className="truncate" title={issue}>
                                • {issue}
                              </div>
                            ))}
                            {result.issues.length > 2 && (
                              <div>+{result.issues.length - 2} more</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {filteredResults && filteredResults.recommendations && filteredResults.recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Recommendations
            </h3>
            
            <div className="space-y-4">
              {filteredResults.recommendations.map((rec, index) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-yellow-800">{rec.issue}</div>
                      <div className="text-sm text-yellow-700 mt-1">{rec.recommendation}</div>
                      <div className="text-xs text-yellow-600 mt-2">
                        {rec.browser} • {rec.testType}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results State */}
        {!qaResults && !isRunning && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No QA Results Yet</h3>
            <p className="text-gray-600 mb-6">Run comprehensive QA tests to see quality metrics and recommendations.</p>
            <button
              onClick={runQATests}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start QA Testing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QADashboard;




