// Vercel Serverless Function - Apple Reminders Integration
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }

  // Since Apple Reminders doesn't have a public API, we'll provide alternatives
  const alternatives = [
    {
      id: 'csv_import',
      name: 'CSV Import',
      description: 'Import reminders from CSV file exported from Apple Reminders',
      type: 'file_upload',
      supported: true
    },
    {
      id: 'ical_import', 
      name: 'iCal Import',
      description: 'Import reminders from iCal file',
      type: 'file_upload',
      supported: true
    },
    {
      id: 'manual_entry',
      name: 'Manual Entry',
      description: 'Manually add reminders to LifeOS',
      type: 'manual',
      supported: true
    },
    {
      id: 'todoist_sync',
      name: 'Todoist Sync',
      description: 'Use Todoist as an alternative to Apple Reminders',
      type: 'integration',
      supported: true
    }
  ];

  res.status(200).json({
    success: true,
    message: 'Apple Reminders integration options available',
    status: 'setup_required',
    alternatives,
    instructions: {
      csv_import: 'Export your Apple Reminders as CSV from the Reminders app, then upload here',
      ical_import: 'Export your Apple Reminders as iCal from the Reminders app, then upload here',
      manual_entry: 'Add reminders directly in LifeOS',
      todoist_sync: 'Connect Todoist integration instead'
    }
  });
}
