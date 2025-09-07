# Google Calendar API Setup Guide

## 🚀 **Step-by-Step Google Calendar Integration Setup**

### **Step 1: Create Google Cloud Project**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Project name: `LifeOS-Integrations`
   - Click "Create"

3. **Enable Google Calendar API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

### **Step 2: Create OAuth 2.0 Credentials**

1. **Go to Credentials**
   - Navigate to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"

2. **Configure OAuth Consent Screen**
   - If prompted, configure the OAuth consent screen:
     - User Type: External
     - App name: `LifeOS`
     - User support email: Your email
     - Developer contact: Your email
     - Add scopes: `https://www.googleapis.com/auth/calendar`

3. **Create OAuth Client**
   - Application type: "Web application"
   - Name: `LifeOS Web Client`
   - Authorized redirect URIs:
     - `http://localhost:3001/api/auth/google/callback`
     - `http://localhost:3000/api/auth/google/callback`

4. **Get Credentials**
   - Copy the Client ID and Client Secret
   - Save them securely

### **Step 3: Configure Environment Variables**

1. **Backend Environment (.env)**
   ```bash
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
   
   # Additional Google APIs
   GOOGLE_CALENDAR_API_KEY=your_api_key_here
   ```

2. **Frontend Environment (.env)**
   ```bash
   # Google OAuth (for frontend)
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
   ```

### **Step 4: Test the Integration**

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend Server**
   ```bash
   npm start
   ```

3. **Test OAuth Flow**
   - Navigate to: http://localhost:3000/integrations
   - Click "Connect" on Google Calendar
   - Complete OAuth flow
   - Verify calendar access

### **Step 5: Verify Integration**

1. **Check Backend Logs**
   - Look for successful OAuth callback
   - Verify token storage

2. **Test Calendar Operations**
   - Create a test event
   - List calendar events
   - Verify two-way sync

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"Redirect URI mismatch"**
   - Ensure redirect URIs match exactly
   - Check for trailing slashes

2. **"Invalid client"**
   - Verify Client ID and Secret
   - Check project is active

3. **"Access denied"**
   - Verify OAuth consent screen is configured
   - Check scopes are properly requested

### **Testing Commands:**

```bash
# Test OAuth initiation
curl -X POST http://localhost:3001/api/integrations/connect/google-calendar \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user"}'

# Test calendar access (after OAuth)
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://www.googleapis.com/calendar/v3/calendars/primary/events
```

---

## 📋 **Next Steps After Setup**

1. **Gmail Integration** - Use same Google Cloud project
2. **Todoist Integration** - Separate API setup
3. **Apple Reminders** - Mock implementation (already working)
4. **Production Deployment** - Update redirect URIs for production domains

---

## 🎯 **Success Criteria**

- ✅ OAuth flow completes successfully
- ✅ Calendar events can be created/read
- ✅ Integration status shows "Connected"
- ✅ Sync operations work
- ✅ Error handling is robust

**Ready to implement!** 🚀
