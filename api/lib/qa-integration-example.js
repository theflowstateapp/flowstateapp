// Example integration of QA banner into app shell
// This shows how to add the QA banner to your main app layout

const { checkQAStatus, renderQABanner } = require('./lib/qa-banner');

// Example function for server-side rendering
async function renderAppShell(user, content) {
  // Check QA status
  const qaStatus = await checkQAStatus();
  const qaBanner = renderQABanner(qaStatus);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowState - Your Personal Operating System</title>
    <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .app-container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="header">
            <h1>FlowState</h1>
            <p>Your Personal Operating System</p>
        </div>
        
        ${qaBanner}
        
        <div class="content">
            ${content}
        </div>
    </div>
</body>
</html>`;
}

// Example for Next.js getServerSideProps
async function getServerSideProps(context) {
  const qaStatus = await checkQAStatus();
  
  return {
    props: {
      qaStatus,
      // ... other props
    }
  };
}

// Example for React component
function QABanner({ qaStatus }) {
  if (!qaStatus.shouldShowBanner) {
    return null;
  }

  return (
    <div style={{
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '6px',
      padding: '12px 16px',
      margin: '0 0 16px 0',
      color: '#991b1b',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span style={{ fontSize: '16px' }}>⚠️</span>
      <div>
        <strong>QA Alert:</strong> Some systems failed QA in the last run ({qaStatus.hoursSinceRun}h ago). 
        Demo may use Safe Mode.
        <a href="/api/admin/qa" style={{ color: '#991b1b', textDecoration: 'underline', marginLeft: '8px' }}>
          View Details
        </a>
      </div>
    </div>
  );
}

module.exports = {
  renderAppShell,
  getServerSideProps,
  QABanner
};
