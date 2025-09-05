const { google } = require('googleapis');
const crypto = require('crypto');

class GoogleCalendarIntegration {
  constructor(accessToken, refreshToken = null) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.calendar = google.calendar({ version: 'v3' });
  }

  // Initialize the OAuth2 client
  getAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
    });

    return oauth2Client;
  }

  // Get user's calendar list
  async getCalendarList() {
    try {
      const auth = this.getAuthClient();
      const response = await this.calendar.calendarList.list({
        auth: auth,
        maxResults: 100,
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendar list:', error);
      throw new Error('Failed to fetch calendar list');
    }
  }

  // Get events from a specific calendar
  async getEvents(calendarId = 'primary', timeMin = null, timeMax = null, maxResults = 100) {
    try {
      const auth = this.getAuthClient();
      
      const params = {
        auth: auth,
        calendarId: calendarId,
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      };

      if (timeMin) {
        params.timeMin = timeMin;
      } else {
        // Default to events from 30 days ago
        params.timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      if (timeMax) {
        params.timeMax = timeMax;
      } else {
        // Default to events 90 days in the future
        params.timeMax = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
      }

      const response = await this.calendar.events.list(params);
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  // Create a new event
  async createEvent(calendarId = 'primary', eventData) {
    try {
      const auth = this.getAuthClient();
      
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        location: eventData.location,
        attendees: eventData.attendees || [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      if (eventData.recurrence) {
        event.recurrence = [eventData.recurrence];
      }

      const response = await this.calendar.events.insert({
        auth: auth,
        calendarId: calendarId,
        resource: event,
      });

      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  // Update an existing event
  async updateEvent(calendarId = 'primary', eventId, eventData) {
    try {
      const auth = this.getAuthClient();
      
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        location: eventData.location,
        attendees: eventData.attendees || [],
      };

      if (eventData.recurrence) {
        event.recurrence = [eventData.recurrence];
      }

      const response = await this.calendar.events.update({
        auth: auth,
        calendarId: calendarId,
        eventId: eventId,
        resource: event,
      });

      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  // Delete an event
  async deleteEvent(calendarId = 'primary', eventId) {
    try {
      const auth = this.getAuthClient();
      
      await this.calendar.events.delete({
        auth: auth,
        calendarId: calendarId,
        eventId: eventId,
      });

      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  // Sync events from Google Calendar to LifeOS
  async syncToLifeOS(userId, lastSyncTime = null) {
    try {
      const events = await this.getEvents('primary', lastSyncTime);
      const syncedEvents = [];

      for (const event of events) {
        const lifeOSEvent = {
          id: event.id,
          title: event.summary,
          description: event.description,
          startTime: event.start.dateTime || event.start.date,
          endTime: event.end.dateTime || event.end.date,
          location: event.location,
          attendees: event.attendees?.map(a => a.email) || [],
          isRecurring: !!event.recurrence,
          recurrence: event.recurrence,
          source: 'google_calendar',
          sourceId: event.id,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // TODO: Save to LifeOS database
        syncedEvents.push(lifeOSEvent);
      }

      return {
        success: true,
        eventsSynced: syncedEvents.length,
        events: syncedEvents,
      };
    } catch (error) {
      console.error('Error syncing to LifeOS:', error);
      throw new Error('Failed to sync calendar to LifeOS');
    }
  }

  // Sync events from LifeOS to Google Calendar
  async syncFromLifeOS(userId, lifeOSEvents) {
    try {
      const syncedEvents = [];

      for (const event of lifeOSEvents) {
        if (event.source === 'google_calendar' && event.sourceId) {
          // Update existing event
          const updatedEvent = await this.updateEvent('primary', event.sourceId, {
            title: event.title,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            location: event.location,
            attendees: event.attendees,
          });
          syncedEvents.push(updatedEvent);
        } else {
          // Create new event
          const newEvent = await this.createEvent('primary', {
            title: event.title,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            location: event.location,
            attendees: event.attendees,
          });
          syncedEvents.push(newEvent);
        }
      }

      return {
        success: true,
        eventsSynced: syncedEvents.length,
        events: syncedEvents,
      };
    } catch (error) {
      console.error('Error syncing from LifeOS:', error);
      throw new Error('Failed to sync from LifeOS to Google Calendar');
    }
  }

  // Get user profile information
  async getUserProfile() {
    try {
      const auth = this.getAuthClient();
      const oauth2 = google.oauth2({ version: 'v2' });
      
      const response = await oauth2.userinfo.get({
        auth: auth,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  // Check if tokens are valid
  async validateTokens() {
    try {
      await this.getUserProfile();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        refresh_token: this.refreshToken,
      });

      const { credentials } = await oauth2Client.refreshAccessToken();
      return credentials.access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw new Error('Failed to refresh access token');
    }
  }
}

module.exports = GoogleCalendarIntegration;

