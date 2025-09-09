const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get latest QA run for summary
    const { data: latestRun, error: latestError } = await supabase
      .from('qa_runs')
      .select('ok, ts, build_id, total_ms, steps')
      .order('ts', { ascending: false })
      .limit(1)
      .single();

    // Get last 20 runs for history table
    const { data: runs, error: historyError } = await supabase
      .from('qa_runs')
      .select('ts, ok, total_ms, build_id, steps')
      .order('ts', { ascending: false })
      .limit(20);

    if (latestError && latestError.code !== 'PGRST116') {
      console.error('Failed to fetch QA runs:', latestError);
    }

    const latest = latestRun || null;
    const history = runs || [];

    // Generate HTML
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QA Runs - FlowState Admin</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: #2563eb;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .summary {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        .summary-pill {
            background: ${latest?.ok ? '#10b981' : '#ef4444'};
            color: white;
            padding: 12px 20px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
        }
        .summary-info {
            background: #f3f4f6;
            padding: 12px 20px;
            border-radius: 8px;
            flex: 1;
            min-width: 200px;
        }
        .actions {
            margin-bottom: 30px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .btn {
            background: #2563eb;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
        }
        .btn:hover {
            background: #1d4ed8;
        }
        .btn-secondary {
            background: #6b7280;
        }
        .btn-secondary:hover {
            background: #4b5563;
        }
        .btn-danger {
            background: #dc2626;
        }
        .btn-danger:hover {
            background: #b91c1c;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            background: #f9fafb;
            font-weight: 600;
            color: #374151;
        }
        .status-pass {
            color: #10b981;
            font-weight: bold;
        }
        .status-fail {
            color: #ef4444;
            font-weight: bold;
        }
        .failing-steps {
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
        }
        .timestamp {
            font-family: monospace;
            font-size: 12px;
            color: #6b7280;
        }
        .build-id {
            font-family: monospace;
            font-size: 11px;
            color: #9ca3af;
        }
        .no-data {
            text-align: center;
            color: #6b7280;
            padding: 40px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>QA Runs</h1>
        </div>
        <div class="content">
            ${latest ? `
                <div class="summary">
                    <div class="summary-pill">
                        Latest: ${latest.ok ? 'PASS' : 'FAIL'}
                    </div>
                    <div class="summary-info">
                        <div><strong>Time:</strong> ${new Date(latest.ts).toLocaleString()}</div>
                        <div><strong>Duration:</strong> ${latest.total_ms}ms</div>
                        <div><strong>Build:</strong> <span class="build-id">${latest.build_id || 'N/A'}</span></div>
                        ${!latest.ok && latest.steps ? `
                            <div><strong>Failed Steps:</strong> ${latest.steps.filter(s => !s.ok).map(s => s.name).join(', ')}</div>
                        ` : ''}
                    </div>
                </div>
            ` : `
                <div class="summary">
                    <div class="summary-pill" style="background: #6b7280;">
                        Latest: No Data
                    </div>
                </div>
            `}

            <div class="actions">
                <form method="post" action="/api/qa/run" style="display: inline;">
                    <input type="hidden" name="secret" value="${process.env.QA_SECRET || ''}">
                    <button type="submit" class="btn">Run Now</button>
                </form>
                <a href="/api/qa/seed?secret=${process.env.QA_SECRET || ''}" class="btn btn-secondary">Seed</a>
                <a href="/api/qa/reset?secret=${process.env.QA_SECRET || ''}" class="btn btn-danger">Reset</a>
            </div>

            <h2>Recent Runs</h2>
            ${history.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Build ID</th>
                            <th>Failed Steps</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${history.map(run => `
                            <tr>
                                <td class="timestamp">${new Date(run.ts).toLocaleString()}</td>
                                <td class="${run.ok ? 'status-pass' : 'status-fail'}">
                                    ${run.ok ? 'PASS' : 'FAIL'}
                                </td>
                                <td>${run.total_ms}ms</td>
                                <td class="build-id">${run.build_id || 'N/A'}</td>
                                <td>
                                    ${run.ok ? '0' : (run.steps?.filter(s => !s.ok)?.length || 0)}
                                    ${!run.ok && run.steps ? `
                                        <div class="failing-steps">
                                            ${run.steps.filter(s => !s.ok).map(s => s.name).join(', ')}
                                        </div>
                                    ` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : `
                <div class="no-data">
                    No QA runs found. Click "Run Now" to start testing.
                </div>
            `}
        </div>
    </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(200).send(html);

  } catch (error) {
    console.error('QA Admin error:', error);
    return res.status(500).send(`
      <html>
        <body>
          <h1>Error</h1>
          <p>Failed to load QA admin page: ${error.message}</p>
        </body>
      </html>
    `);
  }
};
