// Development utilities for testing onboarding tour
export const TourUtils = {
  // Reset tour completion status (for testing)
  resetTour: () => {
    localStorage.removeItem('flowstate-tour-completed');
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
  console.log('TourUtils available in console:');
  console.log('- TourUtils.resetTour() - Reset tour completion');
  console.log('- TourUtils.startTour() - Start tour immediately');
  console.log('- TourUtils.isTourCompleted() - Check completion status');
  console.log('- TourUtils.getTourAnalytics() - Get analytics data');
}
