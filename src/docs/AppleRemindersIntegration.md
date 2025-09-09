# Apple Reminders Integration Guide

## Overview

FlowState now includes comprehensive Apple Reminders integration, allowing you to seamlessly import and sync your existing reminders from Apple's native Reminders app. This integration is designed to work with iPhone, iPad, and Mac devices.

## Features

### 🔗 **Connection & Authentication**
- **One-click connection** to Apple Reminders
- **Permission-based access** using Apple's EventKit framework
- **Real-time status** showing connection state and last sync time
- **Automatic device detection** for iOS/macOS compatibility

### 📥 **Import Functionality**
- **Bulk import** of all reminders or specific lists
- **Smart categorization** with automatic tag generation
- **Priority mapping** from Apple Reminders to FlowState
- **Progress tracking** with real-time import status
- **Selective import** by list, priority, or completion status

### 🔄 **Sync Capabilities**
- **Bidirectional sync** between FlowState and Apple Reminders
- **Configurable sync frequency** (hourly, daily, weekly, manual)
- **Auto-sync toggle** for continuous synchronization
- **Conflict resolution** for simultaneous edits
- **Change tracking** with timestamps and metadata

### 🏷️ **Smart Organization**
- **Automatic tagging** based on content analysis
- **List-based categorization** preserving Apple Reminders structure
- **Location-aware** reminders with geographic context
- **Priority preservation** maintaining urgency levels
- **Due date mapping** with timezone support

## Setup Instructions

### 1. **Access Integration Settings**
1. Navigate to **Settings** → **Integrations**
2. Locate the **Apple Reminders Integration** section
3. Click **Connect** to begin the setup process

### 2. **Grant Permissions**
1. Your device will prompt for Apple Reminders access
2. Select **Allow** to grant permission
3. FlowState will verify the connection

### 3. **Configure Import Options**
- **Import Completed Tasks**: Toggle to include finished reminders
- **Auto Sync**: Enable for continuous synchronization
- **Sync Frequency**: Choose your preferred update interval

### 4. **Import Your Data**
1. Review available reminder lists
2. Choose **Import All** or select specific lists
3. Monitor progress with the real-time progress bar
4. Verify imported tasks in your FlowState dashboard

## Data Mapping

### **Reminder → Task Conversion**

| Apple Reminders | FlowState Task | Notes |
|----------------|----------------|-------|
| Title | Title | Direct mapping |
| Notes | Description | Preserved as-is |
| Due Date | Due Date | Timezone-aware |
| Priority | Priority | High/Medium/Low |
| List | Tags | Added as category tag |
| Location | Metadata | Stored in task metadata |
| Completion | Status | Completed/Pending |

### **Automatic Tag Generation**

The system intelligently generates tags based on:

- **List Name**: Shopping, Work, Personal, etc.
- **Content Analysis**: Keywords like "call", "buy", "meeting"
- **Priority Level**: "urgent" for high-priority items
- **Location Data**: "location" tag for geo-tagged reminders
- **Context Clues**: Work-related, health-related, etc.

## Sync Behavior

### **Import Process**
1. **Fetch** reminders from Apple Reminders
2. **Convert** to FlowState task format
3. **Apply** smart categorization and tagging
4. **Store** with metadata and original references
5. **Update** sync timestamp

### **Bidirectional Sync**
- **FlowState → Apple**: Task changes sync back to original reminders
- **Apple → FlowState**: New reminders appear in FlowState
- **Conflict Resolution**: Last-modified-wins with user notification
- **Metadata Preservation**: Original Apple Reminders data maintained

## Troubleshooting

### **Common Issues**

#### **Connection Failed**
- **Check device compatibility**: Ensure iOS 13+ or macOS 10.15+
- **Verify permissions**: Re-grant Apple Reminders access
- **Network connectivity**: Ensure stable internet connection
- **Restart app**: Close and reopen FlowState

#### **Import Issues**
- **Empty lists**: Verify Apple Reminders has data
- **Permission denied**: Re-authorize in device settings
- **Sync conflicts**: Check for simultaneous edits
- **Data corruption**: Re-import with fresh connection

#### **Sync Problems**
- **Stale data**: Manual sync may be needed
- **Rate limiting**: Reduce sync frequency
- **Authentication expired**: Reconnect to Apple Reminders
- **Storage full**: Clear old sync data

### **Performance Optimization**

#### **Large Datasets**
- **Batch imports**: Import lists separately for better performance
- **Selective sync**: Disable auto-sync for large datasets
- **Cleanup**: Remove old completed tasks periodically
- **Storage management**: Monitor sync data usage

#### **Network Considerations**
- **WiFi recommended**: Use stable connection for initial import
- **Background sync**: Enable only on WiFi to save data
- **Offline mode**: Changes queue for next sync
- **Retry logic**: Automatic retry for failed syncs

## Best Practices

### **Data Management**
1. **Regular backups**: Export data before major imports
2. **Incremental imports**: Start with recent reminders
3. **List organization**: Use Apple Reminders lists strategically
4. **Cleanup routine**: Archive old completed tasks

### **Workflow Integration**
1. **Hybrid approach**: Use both Apple Reminders and FlowState
2. **Quick capture**: Use Apple Reminders for rapid input
3. **Deep work**: Use FlowState for detailed task management
4. **Sync schedule**: Set appropriate sync frequency

### **Privacy & Security**
1. **Data encryption**: All sync data encrypted in transit
2. **Local storage**: Sensitive data stored locally
3. **Permission control**: Granular access controls
4. **Data retention**: Configurable cleanup policies

## API Reference

### **AppleRemindersService Methods**

```javascript
// Connection management
await AppleRemindersService.requestPermission()
await AppleRemindersService.disconnect()

// Data operations
await AppleRemindersService.fetchReminders()
await AppleRemindersService.importReminders(options)
await AppleRemindersService.getReminderLists()

// Sync operations
await AppleRemindersService.syncToAppleReminders(task)

// Status checking
AppleRemindersService.getStatus()
```

### **Import Options**

```javascript
const options = {
  completed: false,        // Include completed reminders
  list: 'Shopping',       // Specific list name
  priority: 'high',       // Filter by priority
  dateRange: {            // Date range filter
    start: new Date(),
    end: new Date()
  }
}
```

## Support

### **Getting Help**
- **Documentation**: Check this guide for common solutions
- **Community**: Join FlowState user community
- **Support**: Contact support for technical issues
- **Feedback**: Submit feature requests and bug reports

### **System Requirements**
- **iOS**: 13.0 or later
- **macOS**: 10.15 or later
- **FlowState**: Version 1.0.0 or later
- **Storage**: 100MB free space for sync data
- **Network**: Stable internet connection

---

*Last updated: September 2025*
*Version: 1.0.0*



