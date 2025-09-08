const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { sessionId, type, payload = {} } = req.body;
    
    if (!sessionId || !type) {
      return res.status(400).json({ error: 'sessionId and type are required' });
    }
    
    if (!['pause', 'resume', 'distraction', 'note'].includes(type)) {
      return res.status(400).json({ error: 'Invalid event type' });
    }
    
    // Create focus event
    const { data: event, error: eventError } = await supabase
      .from('focus_events')
      .insert({
        session_id: sessionId,
        type: type,
        payload: payload
      })
      .select()
      .single();
    
    if (eventError) {
      throw new Error(`Failed to create focus event: ${eventError.message}`);
    }
    
    // Update session based on event type
    let updateData = {};
    
    if (type === 'distraction') {
      // Increment distraction count
      const { data: session } = await supabase
        .from('focus_sessions')
        .select('distraction_count')
        .eq('id', sessionId)
        .single();
      
      updateData.distraction_count = (session?.distraction_count || 0) + 1;
    }
    
    if (type === 'note' && payload.text) {
      // Append note to session notes
      const { data: session } = await supabase
        .from('focus_sessions')
        .select('notes')
        .eq('id', sessionId)
        .single();
      
      const existingNotes = session?.notes || '';
      const timestamp = new Date().toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Kolkata',
        hour12: false 
      });
      const newNote = `[${timestamp}] ${payload.text}`;
      
      updateData.notes = existingNotes ? `${existingNotes}\n${newNote}` : newNote;
    }
    
    // Update session if needed
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('focus_sessions')
        .update(updateData)
        .eq('id', sessionId);
      
      if (updateError) {
        throw new Error(`Failed to update session: ${updateError.message}`);
      }
    }
    
    res.status(200).json({
      success: true,
      event: {
        id: event.id,
        type: event.type,
        timestamp: event.ts,
        payload: event.payload
      }
    });
    
  } catch (error) {
    console.error('Focus event error:', error);
    res.status(500).json({ 
      error: 'Failed to log focus event',
      message: error.message 
    });
  }
};
