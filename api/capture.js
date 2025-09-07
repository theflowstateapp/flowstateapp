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

// Simple AI task parsing (in production, this would call OpenAI/Claude)
const parseTaskFromText = (text) => {
  const lowerText = text.toLowerCase();
  
  // Extract priority
  let priority = 'MEDIUM';
  if (lowerText.includes('urgent') || lowerText.includes('asap')) {
    priority = 'URGENT';
  } else if (lowerText.includes('high') || lowerText.includes('important')) {
    priority = 'HIGH';
  } else if (lowerText.includes('low')) {
    priority = 'LOW';
  }

  // Extract estimate
  let estimateMins = 30;
  const estimateMatch = text.match(/(\d+)\s*(mins?|minutes?|min)/i);
  if (estimateMatch) {
    estimateMins = parseInt(estimateMatch[1]);
  }

  // Extract context
  let context = null;
  if (lowerText.includes('deep work') || lowerText.includes('focus')) {
    context = 'Deep Work';
  } else if (lowerText.includes('admin') || lowerText.includes('email') || lowerText.includes('meeting')) {
    context = 'Admin';
  } else if (lowerText.includes('call') || lowerText.includes('phone')) {
    context = 'Calls';
  }

  // Extract due date
  let dueAt = null;
  const dueMatch = text.match(/by\s+(friday|monday|tuesday|wednesday|thursday|saturday|sunday)/i);
  if (dueMatch) {
    const day = dueMatch[1].toLowerCase();
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntil = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6
    };
    const targetDay = daysUntil[day];
    const daysToAdd = (targetDay - dayOfWeek + 7) % 7;
    if (daysToAdd === 0) daysToAdd = 7; // Next week
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + daysToAdd);
    dueAt = dueDate.toISOString().split('T')[0];
  }

  // Extract title (remove time/priority indicators)
  let title = text
    .replace(/;\s*\d+\s*(mins?|minutes?|min)/gi, '')
    .replace(/;\s*(urgent|high|medium|low)/gi, '')
    .replace(/by\s+(friday|monday|tuesday|wednesday|thursday|saturday|sunday)/gi, '')
    .replace(/;\s*(deep work|admin|calls)/gi, '')
    .trim();

  return {
    title,
    priority,
    estimateMins,
    context,
    dueAt,
    confidence: {
      title: 0.9,
      priority: 0.8,
      estimateMins: estimateMatch ? 0.9 : 0.6,
      context: context ? 0.8 : 0.5,
      dueAt: dueMatch ? 0.8 : 0.5
    }
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }

    // Parse the text into structured task data
    const draft = parseTaskFromText(text);

    res.status(200).json({
      success: true,
      draft
    });

  } catch (error) {
    console.error('Error in AI capture:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to parse task'
    });
  }
}
