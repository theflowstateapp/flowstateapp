// User feedback collection for Pre-Focus Ritual
// Gather insights on ritual effectiveness and user preferences

const collectPreFocusFeedback = {
  // Collect feedback after session completion
  collectSessionFeedback: (sessionData) => {
    const feedback = {
      sessionId: sessionData.id,
      timestamp: new Date().toISOString(),
      questions: [
        {
          id: 'ritual_helpful',
          question: 'Did the preparation ritual help you focus better?',
          type: 'scale',
          options: [1, 2, 3, 4, 5],
          labels: ['Not at all', 'Slightly', 'Moderately', 'Very much', 'Extremely']
        },
        {
          id: 'intention_clarity',
          question: 'How clear was your intention for this session?',
          type: 'scale',
          options: [1, 2, 3, 4, 5],
          labels: ['Very unclear', 'Unclear', 'Neutral', 'Clear', 'Very clear']
        },
        {
          id: 'ritual_items_used',
          question: 'Which preparation items did you find most helpful?',
          type: 'multiple_choice',
          options: ['tabs_closed', 'phone_silent', 'materials_ready'],
          labels: ['Close tabs', 'Silence phone', 'Gather materials']
        },
        {
          id: 'duration_appropriate',
          question: 'Was the session duration appropriate for your task?',
          type: 'scale',
          options: [1, 2, 3, 4, 5],
          labels: ['Too short', 'Short', 'Just right', 'Long', 'Too long']
        },
        {
          id: 'improvement_suggestions',
          question: 'What would improve your Pre-Focus Ritual experience?',
          type: 'text',
          placeholder: 'Optional suggestions...'
        }
      ]
    };
    
    return feedback;
  },
  
  // Collect weekly ritual effectiveness feedback
  collectWeeklyFeedback: (weeklyStats) => {
    return {
      week: weeklyStats.week,
      timestamp: new Date().toISOString(),
      questions: [
        {
          id: 'ritual_consistency',
          question: 'How consistently did you use the Pre-Focus Ritual this week?',
          type: 'scale',
          options: [1, 2, 3, 4, 5],
          labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
        },
        {
          id: 'focus_improvement',
          question: 'How much has your focus improved since using the ritual?',
          type: 'scale',
          options: [1, 2, 3, 4, 5],
          labels: ['No improvement', 'Slight', 'Moderate', 'Significant', 'Dramatic']
        },
        {
          id: 'favorite_ritual_item',
          question: 'Which ritual item helps you most?',
          type: 'single_choice',
          options: ['tabs_closed', 'phone_silent', 'materials_ready', 'none'],
          labels: ['Close tabs', 'Silence phone', 'Gather materials', 'None']
        },
        {
          id: 'ritual_customization',
          question: 'Would you like to customize your ritual items?',
          type: 'single_choice',
          options: ['yes', 'no', 'maybe'],
          labels: ['Yes', 'No', 'Maybe later']
        }
      ]
    };
  },
  
  // Collect onboarding feedback
  collectOnboardingFeedback: () => {
    return {
      timestamp: new Date().toISOString(),
      questions: [
        {
          id: 'ritual_understanding',
          question: 'How well do you understand the Pre-Focus Ritual?',
          type: 'scale',
          options: [1, 2, 3, 4, 5],
          labels: ['Not at all', 'Poorly', 'Somewhat', 'Well', 'Very well']
        },
        {
          id: 'ritual_appeal',
          question: 'How appealing is the Pre-Focus Ritual to you?',
          type: 'scale',
          options: [1, 2, 3, 4, 5],
          labels: ['Not appealing', 'Slightly', 'Moderately', 'Very', 'Extremely']
        },
        {
          id: 'expected_benefits',
          question: 'What benefits do you expect from the ritual?',
          type: 'multiple_choice',
          options: ['better_focus', 'clearer_goals', 'fewer_distractions', 'more_productive', 'other'],
          labels: ['Better focus', 'Clearer goals', 'Fewer distractions', 'More productive', 'Other']
        }
      ]
    };
  }
};

// Export for use in feedback collection
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { collectPreFocusFeedback };
}

console.log('💬 Pre-Focus Ritual feedback collection system ready!');
