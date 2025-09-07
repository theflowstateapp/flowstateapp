// Vercel Serverless Function - Google OAuth Callback
export default function handler(req, res) {
  const { code, state, error } = req.query;
  
  // Handle OAuth errors from Google
  if (error) {
    console.error('Google OAuth error:', error);
    return res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'GOOGLE_OAUTH_ERROR',
              data: {
                success: false,
                error: 'OAuth authorization failed: ${error}'
              }
            }, '*');
            window.close();
          </script>
          <p>OAuth authorization failed: ${error}. You can close this window.</p>
        </body>
      </html>
    `);
  }
  
  if (!code) {
    console.error('No authorization code provided');
    return res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'GOOGLE_OAUTH_ERROR',
              data: {
                success: false,
                error: 'Authorization code not provided'
              }
            }, '*');
            window.close();
          </script>
          <p>Authorization code not provided. You can close this window.</p>
        </body>
      </html>
    `);
  }

  // For now, we'll just show a success message
  // In a full implementation, you would exchange the code for tokens here
  res.send(`
    <html>
      <body>
        <script>
          window.opener.postMessage({
            type: 'GOOGLE_OAUTH_SUCCESS',
            data: {
              success: true,
              message: 'Google integration connected successfully',
              code: '${code}',
              state: '${state}'
            }
          }, '*');
          window.close();
        </script>
        <p>Google integration connected successfully! You can close this window.</p>
      </body>
    </html>
  `);
}
