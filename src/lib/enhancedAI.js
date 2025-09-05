// Project-specific AI analysis function
export const processProjectWithAI = async (input) => {
  const lowerInput = input.toLowerCase();
  const suggestions = [];

  // Project type detection
  if (lowerInput.includes('campaign') || lowerInput.includes('marketing')) {
    suggestions.push({
      type: 'projectType',
      field: 'type',
      value: 'Campaign',
      confidence: 0.95,
      reason: 'Detected marketing campaign',
      icon: '📢',
      label: 'Set as Campaign',
      description: 'This is a marketing campaign project'
    });
    suggestions.push({
      type: 'category',
      field: 'category',
      value: 'Marketing',
      confidence: 0.95,
      reason: 'Detected marketing activity',
      icon: '📢',
      label: 'Assign to Marketing Category',
      description: 'This project belongs to marketing'
    });
  } else if (lowerInput.includes('product') || lowerInput.includes('launch')) {
    suggestions.push({
      type: 'projectType',
      field: 'type',
      value: 'Product',
      confidence: 0.90,
      reason: 'Detected product-related activity',
      icon: '📦',
      label: 'Set as Product Project',
      description: 'This is a product development project'
    });
    suggestions.push({
      type: 'category',
      field: 'category',
      value: 'Business',
      confidence: 0.90,
      reason: 'Detected business activity',
      icon: '💼',
      label: 'Assign to Business Category',
      description: 'This project belongs to business'
    });
  } else if (lowerInput.includes('research') || lowerInput.includes('study')) {
    suggestions.push({
      type: 'projectType',
      field: 'type',
      value: 'Research',
      confidence: 0.88,
      reason: 'Detected research activity',
      icon: '🔬',
      label: 'Set as Research Project',
      description: 'This is a research project'
    });
    suggestions.push({
      type: 'category',
      field: 'category',
      value: 'Technology',
      confidence: 0.85,
      reason: 'Detected technology activity',
      icon: '💻',
      label: 'Assign to Technology Category',
      description: 'This project belongs to technology'
    });
  } else if (lowerInput.includes('event') || lowerInput.includes('conference')) {
    suggestions.push({
      type: 'projectType',
      field: 'type',
      value: 'Event',
      confidence: 0.92,
      reason: 'Detected event activity',
      icon: '🎉',
      label: 'Set as Event Project',
      description: 'This is an event project'
    });
    suggestions.push({
      type: 'category',
      field: 'category',
      value: 'Marketing',
      confidence: 0.85,
      reason: 'Detected marketing activity',
      icon: '📢',
      label: 'Assign to Marketing Category',
      description: 'This project belongs to marketing'
    });
  } else if (lowerInput.includes('training') || lowerInput.includes('workshop')) {
    suggestions.push({
      type: 'projectType',
      field: 'type',
      value: 'Training',
      confidence: 0.90,
      reason: 'Detected training activity',
      icon: '🎓',
      label: 'Set as Training Project',
      description: 'This is a training project'
    });
    suggestions.push({
      type: 'category',
      field: 'category',
      value: 'HR',
      confidence: 0.85,
      reason: 'Detected HR activity',
      icon: '👥',
      label: 'Assign to HR Category',
      description: 'This project belongs to HR'
    });
  } else if (lowerInput.includes('initiative') || lowerInput.includes('strategy')) {
    suggestions.push({
      type: 'projectType',
      field: 'type',
      value: 'Initiative',
      confidence: 0.88,
      reason: 'Detected strategic initiative',
      icon: '🚀',
      label: 'Set as Initiative',
      description: 'This is a strategic initiative'
    });
    suggestions.push({
      type: 'category',
      field: 'category',
      value: 'Business',
      confidence: 0.85,
      reason: 'Detected business activity',
      icon: '💼',
      label: 'Assign to Business Category',
      description: 'This project belongs to business'
    });
  } else if (lowerInput.includes('service') || lowerInput.includes('support')) {
    suggestions.push({
      type: 'projectType',
      field: 'type',
      value: 'Service',
      confidence: 0.85,
      reason: 'Detected service activity',
      icon: '🛠️',
      label: 'Set as Service Project',
      description: 'This is a service project'
    });
    suggestions.push({
      type: 'category',
      field: 'category',
      value: 'Operations',
      confidence: 0.85,
      reason: 'Detected operations activity',
      icon: '⚙️',
      label: 'Assign to Operations Category',
      description: 'This project belongs to operations'
    });
  }

  // Priority detection
  if (lowerInput.includes('urgent') || lowerInput.includes('critical') || lowerInput.includes('asap')) {
    suggestions.push({
      type: 'priority',
      field: 'priority',
      value: 'Critical',
      confidence: 0.95,
      reason: 'Detected urgency indicators',
      icon: '🔥',
      label: 'Set as Critical Priority',
      description: 'This project requires immediate attention'
    });
  } else if (lowerInput.includes('important') || lowerInput.includes('high priority')) {
    suggestions.push({
      type: 'priority',
      field: 'priority',
      value: 'High',
      confidence: 0.85,
      reason: 'Detected importance indicators',
      icon: '⭐',
      label: 'Set as High Priority',
      description: 'This project is important but not urgent'
    });
  }

  // Area detection
  if (lowerInput.includes('health') || lowerInput.includes('fitness') || lowerInput.includes('workout')) {
    suggestions.push({
      type: 'area',
      field: 'area',
      value: 'Health & Fitness',
      confidence: 0.90,
      reason: 'Detected health and fitness activity',
      icon: '💪',
      label: 'Assign to Health & Fitness Area',
      description: 'This project relates to physical well-being'
    });
  } else if (lowerInput.includes('career') || lowerInput.includes('work') || lowerInput.includes('business')) {
    suggestions.push({
      type: 'area',
      field: 'area',
      value: 'Career',
      confidence: 0.88,
      reason: 'Detected work-related activity',
      icon: '💼',
      label: 'Assign to Career Area',
      description: 'This project relates to professional development'
    });
  } else if (lowerInput.includes('family') || lowerInput.includes('home')) {
    suggestions.push({
      type: 'area',
      field: 'area',
      value: 'Family',
      confidence: 0.85,
      reason: 'Detected family-related activity',
      icon: '👨‍👩‍👧‍👦',
      label: 'Assign to Family Area',
      description: 'This project relates to family relationships'
    });
  } else if (lowerInput.includes('finance') || lowerInput.includes('money') || lowerInput.includes('budget')) {
    suggestions.push({
      type: 'area',
      field: 'area',
      value: 'Finances',
      confidence: 0.86,
      reason: 'Detected financial activity',
      icon: '💰',
      label: 'Assign to Finances Area',
      description: 'This project relates to financial management'
    });
  }

  // Duration detection
  const durationMatch = lowerInput.match(/(\d+)\s*(week|month|day)s?/i);
  if (durationMatch) {
    const amount = parseInt(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase();
    suggestions.push({
      type: 'duration',
      field: 'estimatedDuration',
      value: `${amount} ${unit}${amount > 1 ? 's' : ''}`,
      confidence: 0.92,
      reason: 'Detected duration specification',
      icon: '⏱️',
      label: `Set Duration: ${amount} ${unit}${amount > 1 ? 's' : ''}`,
      description: 'Estimated project duration'
    });
  }

  // Budget detection
  const budgetMatch = lowerInput.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(k|m|b)?/i);
  if (budgetMatch) {
    let budget = parseFloat(budgetMatch[1].replace(/,/g, ''));
    const multiplier = budgetMatch[2]?.toLowerCase();
    if (multiplier === 'k') budget *= 1000;
    else if (multiplier === 'm') budget *= 1000000;
    else if (multiplier === 'b') budget *= 1000000000;
    suggestions.push({
      type: 'budget',
      field: 'budget',
      value: budget.toString(),
      confidence: 0.94,
      reason: 'Detected budget specification',
      icon: '💰',
      label: `Set Budget: $${budget.toLocaleString()}`,
      description: 'Project budget allocation'
    });
  }

  return suggestions;
};

// Enhanced AI suggestions generator with sophisticated pattern recognition
export const generateAISuggestions = (input) => {
  const lowerInput = input.toLowerCase();
  const suggestions = [];

  // Enhanced priority detection with context
  if (lowerInput.includes('urgent') || lowerInput.includes('critical') || lowerInput.includes('asap') || lowerInput.includes('emergency') || lowerInput.includes('immediately')) {
    suggestions.push({
      type: 'priority',
      field: 'priority',
      value: 'Critical',
      confidence: 0.95,
      reason: 'Detected urgency indicators',
      icon: '🔥',
      label: 'Set as Critical Priority',
      description: 'This task requires immediate attention'
    });
  } else if (lowerInput.includes('important') || lowerInput.includes('high priority') || lowerInput.includes('crucial') || lowerInput.includes('essential')) {
    suggestions.push({
      type: 'priority',
      field: 'priority',
      value: 'High',
      confidence: 0.85,
      reason: 'Detected importance indicators',
      icon: '⭐',
      label: 'Set as High Priority',
      description: 'This task is important but not urgent'
    });
  } else if (lowerInput.includes('low priority') || lowerInput.includes('not urgent') || lowerInput.includes('when possible') || lowerInput.includes('someday') || lowerInput.includes('maybe')) {
    suggestions.push({
      type: 'priority',
      field: 'priority',
      value: 'Low',
      confidence: 0.80,
      reason: 'Detected low priority indicators',
      icon: '🌱',
      label: 'Set as Low Priority',
      description: 'This task can be done when convenient'
    });
  }

  // Enhanced life area detection with better context
  if (lowerInput.includes('workout') || lowerInput.includes('exercise') || lowerInput.includes('gym') || lowerInput.includes('fitness') || lowerInput.includes('training') || 
      lowerInput.includes('running') || lowerInput.includes('walking') || lowerInput.includes('jogging') || lowerInput.includes('cycling') || lowerInput.includes('swimming') ||
      lowerInput.includes('yoga') || lowerInput.includes('pilates') || lowerInput.includes('strength') || lowerInput.includes('cardio') || lowerInput.includes('treadmill') ||
      lowerInput.includes('health') || lowerInput.includes('doctor') || lowerInput.includes('medical') || lowerInput.includes('wellness') || lowerInput.includes('nutrition')) {
    suggestions.push({
      type: 'lifeArea',
      field: 'context',
      value: 'Health & Fitness',
      confidence: 0.92,
      reason: 'Detected health and fitness activity',
      icon: '💪',
      label: 'Assign to Health & Fitness',
      description: 'This task relates to physical well-being'
    });
  } else if (lowerInput.includes('work') || lowerInput.includes('career') || lowerInput.includes('job') || lowerInput.includes('office') || lowerInput.includes('professional') ||
             lowerInput.includes('meeting') || lowerInput.includes('presentation') || lowerInput.includes('report') || lowerInput.includes('project') || lowerInput.includes('client') ||
             lowerInput.includes('business') || lowerInput.includes('workplace') || lowerInput.includes('colleague') || lowerInput.includes('team') || lowerInput.includes('deadline')) {
    suggestions.push({
      type: 'lifeArea',
      field: 'context',
      value: 'Career',
      confidence: 0.90,
      reason: 'Detected work-related activity',
      icon: '💼',
      label: 'Assign to Career Life Area',
      description: 'This task relates to professional development'
    });
  } else if (lowerInput.includes('family') || lowerInput.includes('kids') || lowerInput.includes('children') || lowerInput.includes('spouse') || lowerInput.includes('parent') ||
             lowerInput.includes('home') || lowerInput.includes('house') || lowerInput.includes('dinner') || lowerInput.includes('lunch') || lowerInput.includes('breakfast') ||
             lowerInput.includes('cook') || lowerInput.includes('meal') || lowerInput.includes('kitchen') || lowerInput.includes('cleaning') || lowerInput.includes('laundry')) {
    suggestions.push({
      type: 'lifeArea',
      field: 'context',
      value: 'Family',
      confidence: 0.87,
      reason: 'Detected family-related activity',
      icon: '👨‍👩‍👧‍👦',
      label: 'Assign to Family Life Area',
      description: 'This task relates to family relationships'
    });
  } else if (lowerInput.includes('finance') || lowerInput.includes('money') || lowerInput.includes('budget') || lowerInput.includes('investment') || lowerInput.includes('banking') ||
             lowerInput.includes('expense') || lowerInput.includes('saving') || lowerInput.includes('spending') || lowerInput.includes('bill') || lowerInput.includes('payment') ||
             lowerInput.includes('tax') || lowerInput.includes('insurance') || lowerInput.includes('mortgage') || lowerInput.includes('loan') || lowerInput.includes('credit')) {
    suggestions.push({
      type: 'lifeArea',
      field: 'context',
      value: 'Finances',
      confidence: 0.86,
      reason: 'Detected financial activity',
      icon: '💰',
      label: 'Assign to Finances Life Area',
      description: 'This task relates to financial management'
    });
  } else if (lowerInput.includes('learn') || lowerInput.includes('study') || lowerInput.includes('skill') || lowerInput.includes('education') || lowerInput.includes('course') ||
             lowerInput.includes('reading') || lowerInput.includes('book') || lowerInput.includes('research') || lowerInput.includes('investigate') || lowerInput.includes('explore') ||
             lowerInput.includes('knowledge') || lowerInput.includes('training') || lowerInput.includes('workshop') || lowerInput.includes('seminar') || lowerInput.includes('tutorial')) {
    suggestions.push({
      type: 'lifeArea',
      field: 'lifeArea',
      value: 'Personal Growth',
      confidence: 0.85,
      reason: 'Detected learning activity',
      icon: '🌱',
      label: 'Assign to Personal Growth',
      description: 'This task relates to self-improvement'
    });
  }

  // Enhanced project detection with better context
  if (lowerInput.includes('light the world') || lowerInput.includes('writing') || lowerInput.includes('blog') || lowerInput.includes('content') || lowerInput.includes('article') ||
      lowerInput.includes('post') || lowerInput.includes('publish') || lowerInput.includes('draft') || lowerInput.includes('edit') || lowerInput.includes('review')) {
    suggestions.push({
      type: 'project',
      field: 'project',
      value: 'Light the World',
      confidence: 0.92,
      reason: 'Detected writing/content creation activity',
      icon: '📝',
      label: 'Link to Light the World Project',
      description: 'This task supports your writing goals'
    });
  } else if (lowerInput.includes('family table') || lowerInput.includes('cook') || lowerInput.includes('meal') || lowerInput.includes('dinner') || lowerInput.includes('kitchen') ||
             lowerInput.includes('recipe') || lowerInput.includes('food') || lowerInput.includes('grocery') || lowerInput.includes('shopping') || lowerInput.includes('ingredient')) {
    suggestions.push({
      type: 'project',
      field: 'project',
      value: 'Family Table',
      confidence: 0.89,
      reason: 'Detected cooking/meal planning activity',
      icon: '🍳',
      label: 'Link to Family Table Project',
      description: 'This task supports family meal planning'
    });
  } else if (lowerInput.includes('life design') || lowerInput.includes('planning') || lowerInput.includes('goals') || lowerInput.includes('vision') || lowerInput.includes('strategy') ||
             lowerInput.includes('plan') || lowerInput.includes('organize') || lowerInput.includes('structure') || lowerInput.includes('framework') || lowerInput.includes('roadmap')) {
    suggestions.push({
      type: 'project',
      field: 'project',
      value: 'Life Design',
      confidence: 0.88,
      reason: 'Detected life planning activity',
      icon: '🎯',
      label: 'Link to Life Design Project',
      description: 'This task supports life planning goals'
    });
  } else if (lowerInput.includes('home renovation') || lowerInput.includes('renovation') || lowerInput.includes('home improvement') || lowerInput.includes('house') ||
             lowerInput.includes('repair') || lowerInput.includes('maintenance') || lowerInput.includes('construction') || lowerInput.includes('remodel') || lowerInput.includes('upgrade')) {
    suggestions.push({
      type: 'project',
      field: 'project',
      value: 'Home Renovation',
      confidence: 0.87,
      reason: 'Detected home improvement activity',
      icon: '🏠',
      label: 'Link to Home Renovation Project',
      description: 'This task supports home improvement goals'
    });
  }

  // Enhanced time detection with better patterns
  const timeMatch = lowerInput.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)/i);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const period = timeMatch[3].toLowerCase();
    
    // Convert to 24-hour format for HTML time input
    let hour24 = hour;
    if (period.includes('pm') && hour !== 12) {
      hour24 = hour + 12;
    } else if (period.includes('am') && hour === 12) {
      hour24 = 0;
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    suggestions.push({
      type: 'time',
      field: 'reminderTime',
      value: timeString,
      confidence: 0.94,
      reason: 'Detected specific time',
      icon: '⏰',
      label: `Set Reminder Time: ${timeString}`,
      description: 'Set a reminder for this specific time'
    });
  }

  // Enhanced date detection
  if (lowerInput.includes('today') || lowerInput.includes('tonight') || lowerInput.includes('this evening')) {
    const today = new Date().toISOString().split('T')[0];
    suggestions.push({
      type: 'date',
      field: 'doDate',
      value: today,
      confidence: 0.93,
      reason: 'Detected today reference',
      icon: '📅',
      label: `Set Do Date: Today (${today})`,
      description: 'This task should be done today'
    });
  } else if (lowerInput.includes('tomorrow') || lowerInput.includes('next day')) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    suggestions.push({
      type: 'date',
      field: 'doDate',
      value: tomorrowStr,
      confidence: 0.92,
      reason: 'Detected tomorrow reference',
      icon: '📅',
      label: `Set Do Date: Tomorrow (${tomorrowStr})`,
      description: 'This task should be done tomorrow'
    });
  }

  // Enhanced recurrence detection
  if (lowerInput.includes('daily') || lowerInput.includes('every day') || lowerInput.includes('each day') || lowerInput.includes('everyday')) {
    suggestions.push({
      type: 'recurrence',
      field: 'isRecurring',
      value: true,
      confidence: 0.87,
      reason: 'Detected daily recurrence',
      icon: '📅',
      label: 'Make this a Daily Task',
      description: 'This task should repeat every day'
    });
    suggestions.push({
      type: 'recurrence',
      field: 'recurrencePattern',
      value: 'daily',
      confidence: 0.87,
      reason: 'Detected daily recurrence',
      icon: '🔄',
      label: 'Set Daily Recurrence Pattern',
      description: 'Repeat this task daily'
    });
  } else if (lowerInput.includes('weekly') || lowerInput.includes('every week') || lowerInput.includes('each week')) {
    suggestions.push({
      type: 'recurrence',
      field: 'isRecurring',
      value: true,
      confidence: 0.85,
      reason: 'Detected weekly recurrence',
      icon: '📅',
      label: 'Make this a Weekly Task',
      description: 'This task should repeat every week'
    });
    suggestions.push({
      type: 'recurrence',
      field: 'recurrencePattern',
      value: 'weekly',
      confidence: 0.85,
      reason: 'Detected weekly recurrence',
      icon: '🔄',
      label: 'Set Weekly Recurrence Pattern',
      description: 'Repeat this task weekly'
    });
  } else if (lowerInput.includes('monthly') || lowerInput.includes('every month') || lowerInput.includes('each month')) {
    suggestions.push({
      type: 'recurrence',
      field: 'isRecurring',
      value: true,
      confidence: 0.84,
      reason: 'Detected monthly recurrence',
      icon: '📅',
      label: 'Make this a Monthly Task',
      description: 'This task should repeat every month'
    });
  }

  // Enhanced time estimates with more patterns
  const timeEstimateMatch = lowerInput.match(/(\d+)\s*(hour|hr|h|hours?|minute|min|minutes?)/);
  if (timeEstimateMatch) {
    const amount = parseInt(timeEstimateMatch[1]);
    const unit = timeEstimateMatch[2].toLowerCase();
    const hours = unit.includes('hour') ? amount : amount / 60;
    
    suggestions.push({
      type: 'time',
      field: 'estimatedHours',
      value: hours.toString(),
      confidence: 0.93,
      reason: 'Detected time estimate',
      icon: '⏱️',
      label: `Set ${amount} ${unit} Estimate`,
      description: `This task will take approximately ${amount} ${unit}`
    });
  }

  // Enhanced reminder detection
  if (lowerInput.includes('remind') || lowerInput.includes('alert') || lowerInput.includes('notification') || lowerInput.includes('notify') || lowerInput.includes('ping')) {
    suggestions.push({
      type: 'reminder',
      field: 'reminderType',
      value: 'at_time',
      confidence: 0.80,
      reason: 'Detected reminder request',
      icon: '⏰',
      label: 'Add Time Reminder',
      description: 'Set a reminder for this task'
    });
  }

  // Enhanced location detection with better parsing
  if (lowerInput.includes('location') || lowerInput.includes('place') || lowerInput.includes('at') || lowerInput.includes('in')) {
    const locationMatch = lowerInput.match(/(?:at|location|place|in)\s+([a-zA-Z\s]+?)(?:\s|$|,|\.)/);
    if (locationMatch) {
      suggestions.push({
        type: 'location',
        field: 'location',
        value: locationMatch[1].trim(),
        confidence: 0.75,
        reason: 'Detected location reference',
        icon: '📍',
        label: `Set Location: ${locationMatch[1].trim()}`,
        description: 'Add location-based reminder'
      });
    }
  }

  // Enhanced assignee detection
  if (lowerInput.includes('sarah') || lowerInput.includes('smith')) {
    suggestions.push({
      type: 'assignee',
      field: 'assignee',
      value: 'Sarah Smith',
      confidence: 0.88,
      reason: 'Detected assignee name',
      icon: '👤',
      label: 'Assign to Sarah Smith',
      description: 'Sarah Smith will be responsible for this task'
    });
  } else if (lowerInput.includes('mike') || lowerInput.includes('johnson')) {
    suggestions.push({
      type: 'assignee',
      field: 'assignee',
      value: 'Mike Johnson',
      confidence: 0.88,
      reason: 'Detected assignee name',
      icon: '👤',
      label: 'Assign to Mike Johnson',
      description: 'Mike Johnson will be responsible for this task'
    });
  }

  // Enhanced icon detection with better context
  if (lowerInput.includes('workout') || lowerInput.includes('exercise') || lowerInput.includes('gym') || lowerInput.includes('fitness') || lowerInput.includes('training')) {
    if (lowerInput.includes('walking') || lowerInput.includes('treadmill')) {
      suggestions.push({
        type: 'icon',
        field: 'icon',
        value: '🚶',
        confidence: 0.91,
        reason: 'Detected walking activity',
        icon: '🚶',
        label: 'Use Walking Icon',
        description: 'This appears to be a walking exercise task'
      });
    } else if (lowerInput.includes('running') || lowerInput.includes('jogging')) {
      suggestions.push({
        type: 'icon',
        field: 'icon',
        value: '🏃',
        confidence: 0.90,
        reason: 'Detected running activity',
        icon: '🏃',
        label: 'Use Running Icon',
        description: 'This appears to be a running exercise task'
      });
    } else {
      suggestions.push({
        type: 'icon',
        field: 'icon',
        value: '💪',
        confidence: 0.89,
        reason: 'Detected general workout activity',
        icon: '💪',
        label: 'Use Workout Icon',
        description: 'This appears to be a general workout task'
      });
    }
  } else if (lowerInput.includes('meeting') || lowerInput.includes('schedule') || lowerInput.includes('appointment')) {
    suggestions.push({
      type: 'icon',
      field: 'icon',
      value: '📅',
      confidence: 0.90,
      reason: 'Detected meeting/scheduling',
      icon: '📅',
      label: 'Use Meeting Icon',
      description: 'This appears to be a meeting or scheduling task'
    });
  } else if (lowerInput.includes('research') || lowerInput.includes('find') || lowerInput.includes('investigate')) {
    suggestions.push({
      type: 'icon',
      field: 'icon',
      value: '🔍',
      confidence: 0.85,
      reason: 'Detected research activity',
      icon: '🔍',
      label: 'Use Research Icon',
      description: 'This appears to be a research task'
    });
  } else if (lowerInput.includes('call') || lowerInput.includes('phone') || lowerInput.includes('dial')) {
    suggestions.push({
      type: 'icon',
      field: 'icon',
      value: '📞',
      confidence: 0.88,
      reason: 'Detected phone call activity',
      icon: '📞',
      label: 'Use Phone Icon',
      description: 'This appears to be a phone call task'
    });
  } else if (lowerInput.includes('email') || lowerInput.includes('message') || lowerInput.includes('mail')) {
    suggestions.push({
      type: 'icon',
      field: 'icon',
      value: '📧',
      confidence: 0.87,
      reason: 'Detected email activity',
      icon: '📧',
      label: 'Use Email Icon',
      description: 'This appears to be an email task'
    });
  } else if (lowerInput.includes('review') || lowerInput.includes('check') || lowerInput.includes('examine')) {
    suggestions.push({
      type: 'icon',
      field: 'icon',
      value: '📋',
      confidence: 0.86,
      reason: 'Detected review activity',
      icon: '📋',
      label: 'Use Review Icon',
      description: 'This appears to be a review task'
    });
  }

  // Enhanced tag detection with more patterns
  const tagSuggestions = [];
  if (lowerInput.includes('urgent')) tagSuggestions.push('urgent');
  if (lowerInput.includes('important')) tagSuggestions.push('important');
  if (lowerInput.includes('meeting')) tagSuggestions.push('meeting');
  if (lowerInput.includes('call')) tagSuggestions.push('call');
  if (lowerInput.includes('email')) tagSuggestions.push('email');
  if (lowerInput.includes('follow-up') || lowerInput.includes('follow up')) tagSuggestions.push('follow-up');
  if (lowerInput.includes('review')) tagSuggestions.push('review');
  if (lowerInput.includes('planning')) tagSuggestions.push('planning');
  if (lowerInput.includes('research')) tagSuggestions.push('research');
  if (lowerInput.includes('deadline')) tagSuggestions.push('deadline');
  if (lowerInput.includes('milestone')) tagSuggestions.push('milestone');
  if (lowerInput.includes('blocker')) tagSuggestions.push('blocker');
  if (lowerInput.includes('collaboration') || lowerInput.includes('team')) tagSuggestions.push('collaboration');
  if (lowerInput.includes('workout') || lowerInput.includes('exercise') || lowerInput.includes('fitness')) tagSuggestions.push('fitness');
  if (lowerInput.includes('health') || lowerInput.includes('wellness')) tagSuggestions.push('health');
  if (lowerInput.includes('family') || lowerInput.includes('home')) tagSuggestions.push('family');
  if (lowerInput.includes('finance') || lowerInput.includes('money')) tagSuggestions.push('finance');
  if (lowerInput.includes('learning') || lowerInput.includes('study')) tagSuggestions.push('learning');

  if (tagSuggestions.length > 0) {
    suggestions.push({
      type: 'tags',
      field: 'tags',
      value: tagSuggestions,
      confidence: 0.82,
      reason: 'Detected relevant tags',
      icon: '🏷️',
      label: `Add Tags: ${tagSuggestions.join(', ')}`,
      description: 'These tags will help organize your task'
    });
  }

  return suggestions;
};

// OpenAI API Integration
export const analyzeWithOpenAI = async (input) => {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Analyze this task description and extract structured information:

Task: "${input}"

Please extract and return a JSON object with the following fields:
- priority: "Low", "Medium", "High", or "Critical"
- lifeArea: "Career", "Health & Fitness", "Family", "Finances", "Personal Growth", or null
- project: "Light the World", "Family Table", "Life Design", "Home Renovation", or null
- icon: appropriate emoji icon
- time: specific time if mentioned (e.g., "9:00 AM")
- date: "today", "tomorrow", or specific date
- recurrence: "daily", "weekly", "monthly", or null
- estimatedHours: number of hours
- tags: array of relevant tags
- location: location if mentioned
- assignee: person name if mentioned

Return only the JSON object, no additional text.`
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    return null;
  }
};

// Enhanced AI processing with OpenAI fallback
export const processTaskWithAI = async (naturalLanguageInput) => {
  try {
    // First try OpenAI for sophisticated analysis
    const openAIAnalysis = await analyzeWithOpenAI(naturalLanguageInput);
    
    if (openAIAnalysis) {
      // Convert OpenAI response to suggestions format
      const suggestions = [];
      
      if (openAIAnalysis.priority) {
        suggestions.push({
          type: 'priority',
          field: 'priority',
          value: openAIAnalysis.priority,
          confidence: 0.95,
          reason: 'AI-powered priority detection',
          icon: '🤖',
          label: `Set as ${openAIAnalysis.priority} Priority`,
          description: 'AI detected priority level'
        });
      }
      
      if (openAIAnalysis.lifeArea) {
        suggestions.push({
          type: 'lifeArea',
          field: 'context',
          value: openAIAnalysis.lifeArea,
          confidence: 0.93,
          reason: 'AI-powered life area detection',
          icon: '🤖',
          label: `Assign to ${openAIAnalysis.lifeArea}`,
          description: 'AI detected life area'
        });
      }
      
      if (openAIAnalysis.icon) {
        suggestions.push({
          type: 'icon',
          field: 'icon',
          value: openAIAnalysis.icon,
          confidence: 0.90,
          reason: 'AI-powered icon selection',
          icon: '🤖',
          label: `Use ${openAIAnalysis.icon} Icon`,
          description: 'AI suggested appropriate icon'
        });
      }
      
      if (openAIAnalysis.time) {
        suggestions.push({
          type: 'time',
          field: 'reminderTime',
          value: openAIAnalysis.time,
          confidence: 0.94,
          reason: 'AI-powered time detection',
          icon: '🤖',
          label: `Set Time: ${openAIAnalysis.time}`,
          description: 'AI detected specific time'
        });
      }
      
      if (openAIAnalysis.date) {
        let dateValue = openAIAnalysis.date;
        if (dateValue === 'today') {
          dateValue = new Date().toISOString().split('T')[0];
        } else if (dateValue === 'tomorrow') {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          dateValue = tomorrow.toISOString().split('T')[0];
        }
        
        suggestions.push({
          type: 'date',
          field: 'dueDate',
          value: dateValue,
          confidence: 0.93,
          reason: 'AI-powered date detection',
          icon: '🤖',
          label: `Set Date: ${dateValue}`,
          description: 'AI detected date'
        });
      }
      
      if (openAIAnalysis.tags && openAIAnalysis.tags.length > 0) {
        suggestions.push({
          type: 'tags',
          field: 'tags',
          value: openAIAnalysis.tags,
          confidence: 0.88,
          reason: 'AI-powered tag detection',
          icon: '🤖',
          label: `Add Tags: ${openAIAnalysis.tags.join(', ')}`,
          description: 'AI suggested relevant tags'
        });
      }
      
      return suggestions;
    } else {
      // Fallback to enhanced pattern matching with correct field names
      const suggestions = generateAISuggestions(naturalLanguageInput);
      
      // Map old field names to new field names
      return suggestions.map(suggestion => {
        if (suggestion.field === 'priorityLevel') {
          return { ...suggestion, field: 'priority' };
        }
        if (suggestion.field === 'lifeArea') {
          return { ...suggestion, field: 'context' };
        }
        if (suggestion.field === 'doDate') {
          return { ...suggestion, field: 'dueDate' };
        }
        return suggestion;
      });
    }
  } catch (error) {
    console.error('AI processing failed:', error);
    // Fallback to enhanced pattern matching with correct field names
    const suggestions = generateAISuggestions(naturalLanguageInput);
    
    // Map old field names to new field names
    return suggestions.map(suggestion => {
      if (suggestion.field === 'priorityLevel') {
        return { ...suggestion, field: 'priority' };
      }
      if (suggestion.field === 'lifeArea') {
        return { ...suggestion, field: 'context' };
      }
      if (suggestion.field === 'doDate') {
        return { ...suggestion, field: 'dueDate' };
      }
      return suggestion;
    });
  }
};
