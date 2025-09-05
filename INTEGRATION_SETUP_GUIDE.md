# LifeOS Integration Setup Guide
## Complete Setup Instructions for Third-Party Integrations

### Overview
This guide will walk you through setting up all the necessary OAuth credentials and API keys for LifeOS integrations. Follow each section carefully to ensure proper functionality.

---

## Prerequisites

### 1. Development Environment
- Node.js 18+ installed
- npm or yarn package manager
- Git repository cloned
- Backend server running on port 3001
- Frontend server running on port 3000

### 2. Required Accounts
- Google Cloud Console account
- Microsoft Azure account (for Microsoft 365)
- Apple Developer account (optional)
- Todoist account
- Slack workspace

---

## Step 1: Google OAuth Setup

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### 1.2 Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: "LifeOS"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

### 1.3 Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/google/callback`
   - `http://localhost:3000/integrations` (for production)
5. Copy the Client ID and Client Secret

### 1.4 Update Environment Variables
Add to your `.env` file:
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
```

---

## Step 2: Microsoft OAuth Setup

### 2.1 Register Application in Azure
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Fill in details:
   - Name: "LifeOS"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: `http://localhost:3001/api/auth/microsoft/callback`

### 2.2 Configure API Permissions
1. Go to "API permissions"
2. Click "Add a permission"
3. Add Microsoft Graph permissions:
   - `Calendars.ReadWrite`
   - `Mail.ReadWrite`
   - `Tasks.ReadWrite`
   - `User.Read`
   - `offline_access`
4. Click "Grant admin consent"

### 2.3 Create Client Secret
1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Add description and choose expiration
4. Copy the secret value immediately (you won't see it again)

### 2.4 Update Environment Variables
Add to your `.env` file:
```bash
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_REDIRECT_URI=http://localhost:3001/api/auth/microsoft/callback
```

---

## Step 3: Todoist API Setup

### 3.1 Create Todoist App
1. Go to [Todoist App Management](https://app.todoist.com/app/settings/integrations/developer)
2. Click "Create new app"
3. Fill in app details:
   - App name: "LifeOS"
   - App description: "Life management integration"
   - App website: your website URL
4. Copy the Client ID and Client Secret

### 3.2 Update Environment Variables
Add to your `.env` file:
```bash
TODOIST_CLIENT_ID=your-todoist-client-id
TODOIST_CLIENT_SECRET=your-todoist-client-secret
```

---

## Step 4: Slack API Setup

### 4.1 Create Slack App
1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From scratch"
4. Fill in app details:
   - App name: "LifeOS"
   - Workspace: your workspace

### 4.2 Configure OAuth & Permissions
1. Go to "OAuth & Permissions"
2. Add scopes:
   - `channels:read`
   - `chat:write`
   - `users:read`
   - `users:read.email`
3. Copy the Client ID and Client Secret

### 4.3 Configure Event Subscriptions
1. Go to "Event Subscriptions"
2. Enable events
3. Add bot user events:
   - `message.channels`
   - `message.im`
4. Copy the signing secret

### 4.4 Update Environment Variables
Add to your `.env` file:
```bash
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
SLACK_SIGNING_SECRET=your-slack-signing-secret
```

---

## Step 5: Database Setup

### 5.1 Apply Integration Schema
Run the integration schema SQL file:
```bash
# If using PostgreSQL directly
psql -d your_database -f integration-schema.sql

# If using Supabase
# Upload and run the integration-schema.sql file in Supabase SQL editor
```

### 5.2 Verify Tables Created
Check that these tables exist:
- `integration_connections`
- `sync_history`
- `webhook_subscriptions`
- `integration_data_mapping`
- `integration_settings`

---

## Step 6: Backend Setup

### 6.1 Install Dependencies
```bash
cd backend
npm install
```

### 6.2 Configure Environment
1. Copy `env-template-integrations.txt` to `.env`
2. Fill in all your API keys and secrets
3. Generate a secure encryption key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### 6.3 Start Backend Server
```bash
npm run dev
```

### 6.4 Test Health Endpoint
Visit `http://localhost:3001/api/health` to verify the server is running and integrations are configured.

---

## Step 7: Frontend Setup

### 7.1 Add Integration Routes
Update your React router to include the new integration pages:

```javascript
// In your App.js or router configuration
import IntegrationsPage from './pages/IntegrationsPage';
import IntegrationDashboard from './pages/IntegrationDashboard';

// Add routes
<Route path="/integrations" element={<IntegrationsPage />} />
<Route path="/integration-dashboard" element={<IntegrationDashboard />} />
```

### 7.2 Update Navigation
Add integration links to your navigation menu:

```javascript
// In your Sidebar or Header component
<Link to="/integrations" className="nav-link">
  <Icon name="integrations" />
  Integrations
</Link>
```

---

## Step 8: Testing Integrations

### 8.1 Test OAuth Flow
1. Start both frontend and backend servers
2. Navigate to `/integrations`
3. Click "Connect" on Google Calendar
4. Complete the OAuth flow
5. Verify you're redirected back to LifeOS

### 8.2 Test API Endpoints
Use curl or Postman to test:

```bash
# List integrations
curl "http://localhost:3001/api/integrations/list?userId=test-user"

# Check integration status
curl "http://localhost:3001/api/integrations/google_calendar/status?userId=test-user"

# Trigger sync
curl -X POST "http://localhost:3001/api/integrations/google_calendar/sync" \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user", "syncType": "incremental"}'
```

### 8.3 Test Frontend Components
1. Navigate to `/integrations`
2. Verify all integrations are listed
3. Test connection flow
4. Check integration dashboard

---

## Step 9: Production Deployment

### 9.1 Update Redirect URIs
For production, update all OAuth redirect URIs:
- Google: `https://yourdomain.com/api/auth/google/callback`
- Microsoft: `https://yourdomain.com/api/auth/microsoft/callback`
- Slack: `https://yourdomain.com/api/auth/slack/callback`

### 9.2 Environment Variables
Update production environment variables:
```bash
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
ENCRYPTION_KEY=your-production-encryption-key
```

### 9.3 SSL Certificate
Ensure you have a valid SSL certificate for OAuth to work properly.

### 9.4 Database Migration
Run the integration schema on your production database.

---

## Troubleshooting

### Common Issues

#### 1. OAuth Redirect URI Mismatch
**Error**: "redirect_uri_mismatch"
**Solution**: Ensure the redirect URI in your OAuth app matches exactly what's in your environment variables.

#### 2. Invalid Client Secret
**Error**: "invalid_client"
**Solution**: Double-check your client secret and ensure it's not expired.

#### 3. API Rate Limits
**Error**: "quota_exceeded"
**Solution**: Implement proper rate limiting and caching in your application.

#### 4. CORS Issues
**Error**: "CORS policy blocked"
**Solution**: Ensure your CORS configuration includes the correct origins.

#### 5. Database Connection Issues
**Error**: "Database connection failed"
**Solution**: Check your database connection string and ensure the database is accessible.

### Debug Mode
Enable debug mode for detailed logging:
```bash
DEBUG=true
LOG_LEVEL=debug
```

### Logs
Check the logs for detailed error information:
```bash
tail -f logs/integrations.log
```

---

## Security Best Practices

### 1. Environment Variables
- Never commit API keys to version control
- Use different keys for development and production
- Rotate keys regularly

### 2. Token Storage
- Encrypt all OAuth tokens before storing
- Use secure session management
- Implement token refresh logic

### 3. Rate Limiting
- Implement proper rate limiting for all API endpoints
- Monitor API usage and set appropriate limits

### 4. Data Validation
- Validate all incoming data
- Sanitize user inputs
- Implement proper error handling

### 5. Monitoring
- Set up monitoring for integration health
- Monitor API response times
- Track error rates and sync success rates

---

## Next Steps

### 1. Additional Integrations
Consider adding these integrations next:
- Gmail for email management
- Microsoft Teams for communication
- Google Drive for file storage
- Notion for note-taking

### 2. Advanced Features
- Implement webhook support for real-time updates
- Add conflict resolution for data synchronization
- Create integration analytics dashboard
- Build developer API for third-party integrations

### 3. Partnership Opportunities
- Apply for Google Workspace Add-on program
- Partner with Microsoft for Office 365 integration
- Join Todoist's partner program
- Explore Slack's app marketplace

---

## Support

For additional support:
1. Check the troubleshooting section above
2. Review the API documentation for each service
3. Check the LifeOS integration logs
4. Contact the development team

---

## Conclusion

Once you've completed all steps, you'll have a fully functional integration system that allows users to connect their favorite productivity tools to LifeOS. The system will provide seamless data synchronization and a unified interface for managing all aspects of their digital life.

Remember to test thoroughly in development before deploying to production, and always follow security best practices when handling user data and API credentials.

