# Google APIs Setup Guide for LifeOS

## 🚀 Complete Step-by-Step Instructions

### **Step 1: Google Cloud Console Setup**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**
   - Click on the project dropdown at the top
   - Either select existing project or create new one
   - Project name: "LifeOS" (or any name you prefer)

### **Step 2: Enable Required APIs**

1. **Navigate to APIs & Services**
   - Click hamburger menu (☰) → "APIs & Services" → "Library"

2. **Enable Google Calendar API**
   - Search: "Google Calendar API"
   - Click on it → "ENABLE"

3. **Enable Gmail API**
   - Search: "Gmail API"
   - Click on it → "ENABLE"

4. **Enable People API** (for user info)
   - Search: "People API"
   - Click on it → "ENABLE"

### **Step 3: Configure OAuth Consent Screen**

1. **Go to OAuth Consent Screen**
   - APIs & Services → "OAuth consent screen"

2. **Choose User Type**
   - Select "External" (unless you have Google Workspace)
   - Click "Create"

3. **Fill App Information**
   ```
   App name: LifeOS
   User support email: your-email@example.com
   App logo: (optional)
   App domain: (leave blank for now)
   Developer contact: your-email@example.com
   ```
   - Click "Save and Continue"

4. **Add Scopes**
   - Click "Add or Remove Scopes"
   - Add these scopes:
     ```
     https://www.googleapis.com/auth/calendar
     https://www.googleapis.com/auth/calendar.events
     https://www.googleapis.com/auth/gmail.readonly
     https://www.googleapis.com/auth/gmail.send
     https://www.googleapis.com/auth/userinfo.email
     https://www.googleapis.com/auth/userinfo.profile
     ```
   - Click "Update" → "Save and Continue"

5. **Test Users** (for development)
   - Add your email address as a test user
   - Click "Save and Continue"

### **Step 4: Create OAuth 2.0 Credentials**

1. **Go to Credentials**
   - APIs & Services → "Credentials"

2. **Create OAuth 2.0 Client ID**
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "LifeOS Web Client"

3. **Configure Authorized Redirect URIs**
   - Add these URIs:
     ```
     http://localhost:3001/api/auth/google/callback
     http://localhost:3000/auth/callback
     ```

4. **Create Credentials**
   - Click "Create"
   - **IMPORTANT**: Copy the Client ID and Client Secret immediately
   - You won't be able to see the secret again!

### **Step 5: Configure LifeOS Backend**

1. **Run the setup script**:
   ```bash
   ./setup-google-apis.sh
   ```

2. **Or manually edit backend/.env**:
   ```env
   GOOGLE_CLIENT_ID=your-actual-client-id-here
   GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
   GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
   ```

### **Step 6: Test the Integration**

1. **Restart backend server**:
   ```bash
   cd backend && node server.js
   ```

2. **Visit integrations page**:
   - Go to: http://localhost:3000/integrations

3. **Test Google Calendar**:
   - Click "Setup" on Google Calendar card
   - You should be redirected to Google OAuth
   - Grant permissions
   - You'll be redirected back to LifeOS

4. **Test Gmail**:
   - Click "Setup" on Gmail card
   - Follow same OAuth flow

## 🔧 Troubleshooting

### **Common Issues:**

1. **"redirect_uri_mismatch" Error**
   - Make sure redirect URIs in Google Console match exactly:
     - `http://localhost:3001/api/auth/google/callback`
     - `http://localhost:3000/auth/callback`

2. **"access_denied" Error**
   - Check that you added the required scopes
   - Make sure your app is in "Testing" mode and you're a test user

3. **"invalid_client" Error**
   - Verify Client ID and Secret are correct in backend/.env
   - Make sure there are no extra spaces or characters

4. **APIs not enabled**
   - Double-check that Calendar API, Gmail API, and People API are enabled

### **Verification Steps:**

1. **Check APIs are enabled**:
   - Go to APIs & Services → "Enabled APIs & services"
   - You should see: Google Calendar API, Gmail API, People API

2. **Check OAuth consent screen**:
   - Should show "Testing" status
   - Your email should be in test users

3. **Check credentials**:
   - OAuth 2.0 Client ID should exist
   - Redirect URIs should be configured

## 📋 Quick Reference

### **Required APIs:**
- Google Calendar API
- Gmail API  
- People API

### **Required Scopes:**
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/calendar.events`
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`

### **Redirect URIs:**
- `http://localhost:3001/api/auth/google/callback`
- `http://localhost:3000/auth/callback`

### **Environment Variables:**
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
```

## 🎯 Next Steps

After completing this setup:

1. **Test Google Calendar integration**
2. **Test Gmail integration** 
3. **Set up Todoist integration** (separate process)
4. **Configure production redirect URIs** (when deploying)

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all steps were completed correctly
3. Check Google Cloud Console for any error messages
4. Ensure your backend server is running on port 3001
