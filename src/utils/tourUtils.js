// Development utilities for testing onboarding tour
export const TourUtils = {
  // Initialize tour utilities
  initialize: () => {
    // Initialize tour utilities for the user
    // eslint-disable-next-line no-console
    console.log('TourUtils initialized');
  },

  // Reset tour completion status (for testing)
  resetTour: () => {
    localStorage.removeItem('flowstate-tour-completed');
    // eslint-disable-next-line no-console
    console.log('Tour reset - will show on next login');
  },

  // Check if tour has been completed
  isTourCompleted: () => {
    return localStorage.getItem('flowstate-tour-completed') === 'true';
  },

  // Force start tour (for testing)
  startTour: () => {
    // This will be handled by the OnboardingTour component
    // when isFirstTime is true
    localStorage.removeItem('flowstate-tour-completed');
    window.location.reload();
  },

  // Get tour analytics data
  getTourAnalytics: () => {
    return {
      completed: TourUtils.isTourCompleted(),
      timestamp: localStorage.getItem('flowstate-tour-completed-timestamp'),
    };
  }
};

// Make available in development console
if (process.env.NODE_ENV === 'development') {
  window.TourUtils = TourUtils;
  // eslint-disable-next-line no-console
  console.log('TourUtils available in console:');
  // eslint-disable-next-line no-console
  console.log('- TourUtils.resetTour() - Reset tour completion');
  // eslint-disable-next-line no-console
  console.log('- TourUtils.startTour() - Start tour immediately');
  // eslint-disable-next-line no-console
  console.log('- TourUtils.isTourCompleted() - Check completion status');
  // eslint-disable-next-line no-console
  console.log('- TourUtils.getTourAnalytics() - Get analytics data');
}
