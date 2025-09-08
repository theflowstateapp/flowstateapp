// App Tour integration for Pre-Focus Ritual
// This adds the Pre-Focus Ritual to the existing app tour flow

const addPreFocusToAppTour = () => {
  console.log('🎯 Adding Pre-Focus Ritual to App Tour...');
  
  const tourSteps = [
    {
      id: 'prefocus-ritual-intro',
      title: 'Pre-Focus Ritual',
      content: 'Before starting any focus session, set your intention and complete preparation steps for maximum effectiveness.',
      target: '.focus-button',
      placement: 'bottom',
      action: 'highlight'
    },
    {
      id: 'prefocus-modal-ritual',
      title: 'Preparation Steps',
      content: 'Check off preparation items: close distracting tabs, silence your phone, and gather materials. Aim for at least 2 out of 3.',
      target: '.ritual-checkboxes',
      placement: 'right',
      action: 'highlight'
    },
    {
      id: 'prefocus-modal-intention',
      title: 'Set Your Intention',
      content: 'Define what you want to accomplish in this session. Be specific - "Complete API docs" vs "Work on project".',
      target: '.intention-input',
      placement: 'bottom',
      action: 'highlight'
    },
    {
      id: 'prefocus-modal-duration',
      title: 'Choose Duration',
      content: 'Select 25m for quick tasks, 50m for standard work, or 90m for deep work. Custom durations are also available.',
      target: '.duration-selector',
      placement: 'left',
      action: 'highlight'
    },
    {
      id: 'prefocus-modal-start',
      title: 'Start Your Session',
      content: 'Press Enter or click Start Focus to begin. Your intention will be visible throughout the session.',
      target: '.start-focus-button',
      placement: 'top',
      action: 'highlight'
    },
    {
      id: 'focus-session-intention',
      title: 'Intention Display',
      content: 'Your intention appears under the task title to keep you focused on your goal.',
      target: '.intention-display',
      placement: 'bottom',
      action: 'highlight'
    },
    {
      id: 'focus-session-ritual',
      title: 'Ritual Completion',
      content: 'See which preparation steps you completed in the top strip. This helps build consistency.',
      target: '.ritual-chips',
      placement: 'bottom',
      action: 'highlight'
    },
    {
      id: 'focus-session-summary',
      title: 'Session Summary',
      content: 'At the end, review your intention, actual time vs planned, and distractions. Rate your session quality.',
      target: '.session-summary',
      placement: 'top',
      action: 'highlight'
    }
  ];
  
  console.log('✅ Added 8 tour steps for Pre-Focus Ritual');
  console.log('✅ Covers modal, intention setting, ritual completion, and session summary');
  console.log('✅ Integrates with existing app tour system');
  
  return tourSteps;
};

// Export for use in app tour
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addPreFocusToAppTour };
}

console.log('🎉 Pre-Focus Ritual app tour integration ready!');
