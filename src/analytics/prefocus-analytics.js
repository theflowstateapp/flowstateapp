// Analytics tracking for Pre-Focus Ritual effectiveness
// Track ritual completion rates, intention effectiveness, and session outcomes

const trackPreFocusAnalytics = {
  // Track ritual completion patterns
  trackRitualCompletion: (ritual) => {
    const completed = Object.values(ritual).filter(Boolean).length;
    const total = Object.keys(ritual).length;
    
    return {
      event: 'prefocus_ritual_completed',
      data: {
        completion_rate: completed / total,
        tabs_closed: ritual.tabsClosed,
        phone_silent: ritual.phoneSilent,
        materials_ready: ritual.materialsReady,
        total_completed: completed
      }
    };
  },
  
  // Track intention setting patterns
  trackIntentionSet: (intention, duration) => {
    return {
      event: 'prefocus_intention_set',
      data: {
        has_intention: !!intention,
        intention_length: intention ? intention.length : 0,
        planned_duration: duration,
        intention_categories: analyzeIntentionType(intention)
      }
    };
  },
  
  // Track session outcomes vs intention
  trackSessionOutcome: (intention, actualMinutes, plannedMinutes, distractions, rating) => {
    return {
      event: 'prefocus_session_outcome',
      data: {
        had_intention: !!intention,
        time_efficiency: actualMinutes / plannedMinutes,
        distraction_rate: distractions / actualMinutes,
        self_rating: rating,
        intention_achieved: analyzeIntentionAchievement(intention, actualMinutes, distractions)
      }
    };
  },
  
  // Track Pre-Focus Ritual adoption
  trackRitualAdoption: (sessionCount, ritualCount) => {
    return {
      event: 'prefocus_adoption',
      data: {
        total_sessions: sessionCount,
        sessions_with_ritual: ritualCount,
        adoption_rate: ritualCount / sessionCount,
        time_period: 'weekly'
      }
    };
  }
};

// Helper functions
const analyzeIntentionType = (intention) => {
  if (!intention) return 'none';
  
  const lower = intention.toLowerCase();
  if (lower.includes('complete') || lower.includes('finish')) return 'completion';
  if (lower.includes('write') || lower.includes('create')) return 'creation';
  if (lower.includes('review') || lower.includes('check')) return 'review';
  if (lower.includes('learn') || lower.includes('study')) return 'learning';
  return 'other';
};

const analyzeIntentionAchievement = (intention, actualMinutes, distractions) => {
  if (!intention) return 'no_intention';
  
  // Simple heuristic: longer sessions with fewer distractions suggest better intention achievement
  const distractionRate = distractions / actualMinutes;
  if (actualMinutes >= 25 && distractionRate <= 0.1) return 'high';
  if (actualMinutes >= 15 && distractionRate <= 0.2) return 'medium';
  return 'low';
};

// Export for use in analytics
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { trackPreFocusAnalytics };
}

console.log('📊 Pre-Focus Ritual analytics tracking ready!');
