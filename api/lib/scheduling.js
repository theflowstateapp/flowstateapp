import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Timezone utilities for Asia/Kolkata
const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

export const toIST = (date) => {
  if (!date) return null;
  const utcDate = new Date(date);
  return new Date(utcDate.getTime() + IST_OFFSET);
};

export const parseTime = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getWorkWindowFor = (date, prefs) => {
  const istDate = toIST(date);
  const dayOfWeek = istDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  const startTime = isWeekend ? prefs.weekendStart : prefs.weekdayStart;
  const endTime = isWeekend ? prefs.weekendEnd : prefs.weekdayEnd;
  
  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);
  
  const start = new Date(istDate);
  start.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
  
  const end = new Date(istDate);
  end.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);
  
  return {
    start: new Date(start.getTime() - IST_OFFSET), // Convert back to UTC
    end: new Date(end.getTime() - IST_OFFSET)
  };
};

export interface ProposeOpts {
  now?: Date;
  timezone: string;
  estimateMins: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  preferredContexts?: string[];
  exclude?: Array<{ start: string; end: string }>;
  existingBlocks?: Array<{ start: Date; end: Date }>;
  prefs: {
    weekdayStart: string;
    weekdayEnd: string;
    weekendStart: string;
    weekendEnd: string;
  };
}

export interface ProposedBlock {
  start: string;
  end: string;
  rationale: string;
  score: number;
}

export const proposeTimeBlocks = async (opts: ProposeOpts): Promise<ProposedBlock[]> => {
  const {
    now = new Date(),
    timezone = 'Asia/Kolkata',
    estimateMins = 30,
    priority = 'MEDIUM',
    preferredContexts = [],
    exclude = [],
    existingBlocks = [],
    prefs
  } = opts;

  const proposals: ProposedBlock[] = [];
  const nowIST = toIST(now);
  
  // Search next 7 days, extend to 10 if needed
  const searchDays = 7;
  const maxDays = 10;
  
  for (let dayOffset = 0; dayOffset < maxDays; dayOffset++) {
    const searchDate = new Date(nowIST);
    searchDate.setDate(searchDate.getDate() + dayOffset);
    
    const workWindow = getWorkWindowFor(searchDate, prefs);
    const workStart = workWindow.start;
    const workEnd = workWindow.end;
    
    // Generate time slots within work window
    const slotDuration = estimateMins;
    const slots = [];
    
    let currentTime = new Date(workStart);
    while (currentTime.getTime() + slotDuration * 60 * 1000 <= workEnd.getTime()) {
      const slotEnd = new Date(currentTime.getTime() + slotDuration * 60 * 1000);
      
      // Check if slot conflicts with existing blocks
      const hasConflict = existingBlocks.some(block => {
        const blockStart = new Date(block.start);
        const blockEnd = new Date(block.end);
        return (
          (currentTime >= blockStart && currentTime < blockEnd) ||
          (slotEnd > blockStart && slotEnd <= blockEnd) ||
          (currentTime <= blockStart && slotEnd >= blockEnd)
        );
      });
      
      if (!hasConflict) {
        slots.push({
          start: new Date(currentTime),
          end: new Date(slotEnd),
          dayOffset,
          hour: currentTime.getHours(),
          minute: currentTime.getMinutes()
        });
      }
      
      // Move to next slot (15-minute increments)
      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }
    
    // Score and add slots
    slots.forEach(slot => {
      let score = 50; // Base score
      
      // Priority scoring
      if (priority === 'URGENT') {
        score += dayOffset === 0 ? 40 : (dayOffset === 1 ? 30 : 20 - dayOffset * 5);
      } else if (priority === 'HIGH') {
        score += dayOffset === 0 ? 30 : (dayOffset === 1 ? 20 : 15 - dayOffset * 3);
      } else if (priority === 'MEDIUM') {
        score += dayOffset === 0 ? 20 : (dayOffset === 1 ? 15 : 10 - dayOffset * 2);
      } else {
        score += dayOffset === 0 ? 10 : (dayOffset === 1 ? 8 : 5 - dayOffset);
      }
      
      // Context scoring
      if (preferredContexts.includes('Deep Work')) {
        const hour = slot.hour;
        if (hour >= 10 && hour < 13) {
          score += 25; // Deep work window
        } else if (hour >= 9 && hour < 17) {
          score += 10; // Regular work hours
        }
      } else if (preferredContexts.includes('Admin')) {
        const hour = slot.hour;
        if (hour >= 9 && hour < 17) {
          score += 15; // Admin hours
        }
      }
      
      // Time of day scoring
      const hour = slot.hour;
      if (hour >= 9 && hour < 12) {
        score += 10; // Morning productivity
      } else if (hour >= 14 && hour < 16) {
        score += 5; // Afternoon
      }
      
      // Weekend penalty
      const dayOfWeek = searchDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        score -= 10;
      }
      
      const rationale = generateRationale(slot, priority, preferredContexts, dayOffset);
      
      proposals.push({
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        rationale,
        score: Math.max(0, score)
      });
    });
    
    // If we have enough proposals and we've searched 7 days, break
    if (proposals.length >= 3 && dayOffset >= searchDays - 1) {
      break;
    }
  }
  
  // Sort by score and return top 3
  return proposals
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

const generateRationale = (slot, priority, preferredContexts, dayOffset) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const searchDate = new Date();
  searchDate.setDate(searchDate.getDate() + dayOffset);
  const dayName = dayNames[searchDate.getDay()];
  
  const hour = slot.hour;
  const minute = slot.minute;
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  
  let rationale = `${dayName} ${timeStr}`;
  
  if (dayOffset === 0) {
    rationale += ' • Today';
  } else if (dayOffset === 1) {
    rationale += ' • Tomorrow';
  } else {
    rationale += ` • In ${dayOffset} days`;
  }
  
  if (preferredContexts.includes('Deep Work') && hour >= 10 && hour < 13) {
    rationale += ' • Fits deep work window';
  } else if (preferredContexts.includes('Admin') && hour >= 9 && hour < 17) {
    rationale += ' • Good for admin tasks';
  } else if (hour >= 9 && hour < 12) {
    rationale += ' • Morning productivity';
  }
  
  if (priority === 'URGENT') {
    rationale += ' • Urgent priority';
  } else if (priority === 'HIGH') {
    rationale += ' • High priority';
  }
  
  return rationale;
};

// Get existing scheduled blocks for a workspace
export const getExistingScheduledBlocks = async (workspaceId, startDate, endDate) => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('start_at, end_at')
      .eq('workspace_id', workspaceId)
      .not('start_at', 'is', null)
      .not('end_at', 'is', null)
      .gte('start_at', startDate.toISOString())
      .lte('end_at', endDate.toISOString());
    
    if (error) throw error;
    
    return (tasks || []).map(task => ({
      start: new Date(task.start_at),
      end: new Date(task.end_at)
    }));
  } catch (error) {
    console.error('Error fetching existing scheduled blocks:', error);
    return [];
  }
};

// Get workspace preferences
export const getWorkspacePreferences = async (workspaceId) => {
  try {
    const { data: prefs, error } = await supabase
      .from('workspace_preferences')
      .select('*')
      .eq('workspace_id', workspaceId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    
    return prefs || {
      weekday_start: '09:00',
      weekday_end: '18:00',
      weekend_start: '10:00',
      weekend_end: '16:00',
      timezone: 'Asia/Kolkata'
    };
  } catch (error) {
    console.error('Error fetching workspace preferences:', error);
    return {
      weekday_start: '09:00',
      weekday_end: '18:00',
      weekend_start: '10:00',
      weekend_end: '16:00',
      timezone: 'Asia/Kolkata'
    };
  }
};
