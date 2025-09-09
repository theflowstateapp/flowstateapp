# Flow State - Your Personal Operating System

A comprehensive web application that serves as your personal life management system, inspired by the Notion Life OS template. This application helps you organize, track, and optimize every aspect of your life.

## 🌟 Features

### 📊 Dashboard
- **Overview Metrics**: Track your progress across all life areas
- **Quick Actions**: Fast access to common tasks
- **Recent Activity**: See your latest updates and achievements
- **Today's Focus**: Prioritize your daily tasks

### 🎯 Goals & Vision
- **Goal Management**: Set, track, and achieve your life goals
- **Milestone Tracking**: Break down goals into manageable steps
- **Progress Visualization**: See your progress with beautiful charts
- **Category Organization**: Organize goals by life areas

### 📁 Projects & Tasks
- **Project Management**: Create and manage multiple projects
- **Task Tracking**: Break down projects into actionable tasks
- **Progress Monitoring**: Track completion status and deadlines
- **Team Collaboration**: Manage team members and responsibilities

### 🔄 Habits & Routines
- **Habit Tracking**: Build and maintain positive habits
- **Streak Monitoring**: Track your consistency with visual streaks
- **Daily Check-ins**: Mark habits as complete each day
- **Category Organization**: Group habits by life areas

### ❤️ Health & Wellness
- **Health Metrics**: Track weight, sleep, water intake, and more
- **Exercise Logging**: Record workouts and physical activities
- **Health Score**: Get an overall health assessment
- **Quick Actions**: Fast access to health-related tasks

### 💰 Finance & Budget
- **Income Tracking**: Monitor your monthly income
- **Expense Management**: Track and categorize expenses
- **Budget Planning**: Set and monitor budget limits
- **Savings Goals**: Track your savings progress

### 📚 Learning & Growth
- **Course Management**: Track your learning progress
- **Skill Development**: Monitor skill acquisition
- **Learning Hours**: Track time spent learning
- **Progress Visualization**: See your learning journey

### 👥 Relationships
- **Contact Management**: Organize your personal and professional contacts
- **Relationship Tracking**: Monitor relationship health and follow-ups
- **Communication Log**: Track interactions and conversations
- **Birthday Reminders**: Never miss important dates

### ⏰ Time Management
- **Time Blocking**: Schedule your day effectively
- **Productivity Tracking**: Monitor your productive hours
- **Meeting Management**: Track meetings and appointments
- **Focus Time**: Dedicate time for deep work

### 📝 Journal & Reflection
- **Daily Journaling**: Document your thoughts and experiences
- **Mood Tracking**: Monitor your emotional well-being
- **Reflection Prompts**: Guided reflection questions
- **Entry Organization**: Tag and categorize journal entries

### ⚙️ Settings
- **Profile Management**: Update personal information
- **Notification Preferences**: Customize your alerts
- **Appearance Settings**: Choose themes and colors
- **Privacy Controls**: Manage your data and security

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd life-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## 🧪 QA Testing

### QA System

The application includes a comprehensive QA system with production monitoring:

#### QA Endpoints
- **Reset**: `/api/qa/reset` - Cleans up test data
- **Seed**: `/api/qa/seed` - Creates deterministic test data
- **Smoke Test**: `/api/qa/smoke` - Runs comprehensive end-to-end test
- **Run & Store**: `/api/qa/run` - Runs smoke test and stores results in database
- **Latest Status**: `/api/qa/latest` - Gets most recent QA run status
- **History**: `/api/qa/history` - Gets last N QA runs
- **Admin Panel**: `/api/admin/qa` - HTML admin interface

#### Production Monitoring
- **GitHub Actions**: Automatic QA runs on deployment
- **Database Storage**: All QA runs stored in `qa_runs` table
- **App Banner**: Shows warning if QA failed in last 24 hours
- **Build Integration**: Tracks build IDs and deployment status

All QA endpoints require the `QA_SECRET` environment variable for security.

### Running QA Tests

1. **Set up QA secret**
   ```bash
   export QA_SECRET="your-long-random-string"
   ```

2. **Run QA operations**
   ```bash
   # Reset test data
   npm run qa:reset
   
   # Seed test data
   npm run qa:seed
   
   # Run smoke test (original)
   npm run qa:smoke
   
   # Run smoke test and store results
   npm run qa:run
   
   # Check latest QA status
   npm run qa:latest
   
   # View QA history
   npm run qa:history
   
   # Open admin panel
   npm run qa:admin
   ```

3. **Run Playwright E2E tests**
   ```bash
   # Install Playwright browsers
   npm run test:e2e:install
   
   # Run E2E tests
   npm run test:e2e
   
   # Run E2E tests with browser UI
   npm run test:e2e:headed
   ```

### QA Test Flow

The smoke test validates the complete user journey:
1. Reset → Clean test data
2. Seed → Create test workspace and data
3. Capture → Parse task from text
4. Propose → Schedule task
5. Create Task → Save to database
6. Start Focus → Begin focus session
7. Stop Focus → End focus session
8. Day Summary → Get daily overview
9. Daily Shutdown → Complete day
10. Plan Tomorrow → Schedule next day
11. Weekly Review → Plan next week
12. Agenda Verify → Confirm scheduling

Expected result: JSON report with ~12 steps, most showing `ok: true`.

### Production Setup

1. **Database Setup**
   ```sql
   -- Run the schema file to create qa_runs table
   -- File: qa-runs-schema.sql
   ```

2. **GitHub Secrets**
   - Add `QA_SECRET` to your GitHub repository secrets
   - The GitHub Action will automatically run QA tests on deployment

3. **App Integration**
   - Use `api/lib/qa-banner.js` to add QA status banner to your app
   - Check `api/lib/qa-integration-example.js` for integration examples

4. **Comprehensive Testing**
   ```bash
   # Run the complete QA system test
   ./scripts/qa-system-test.sh
   ```

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#0ea5e9)
- **Secondary**: Purple (#d946ef)
- **Success**: Green (#22c55e)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (#ef4444)

### Typography
- **Font Family**: Inter
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Consistent card design with shadows and borders
- **Buttons**: Multiple button styles (primary, secondary, success, danger)
- **Forms**: Styled form inputs and controls
- **Modals**: Overlay modals for detailed interactions

## 🔧 Customization

### Adding New Features
1. Create new components in the `src/components` directory
2. Add new pages in the `src/pages` directory
3. Update routing in `src/App.js`
4. Add navigation items in `src/components/Sidebar.js`

### Styling
- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for theme customization
- Use Tailwind CSS classes for component styling

### Data Management
- Currently uses React state for data management
- Can be extended with Redux, Context API, or external databases
- Add persistence with localStorage or backend APIs

## 📊 Data Structure

The application uses a modular data structure:

```javascript
// Example data structure for goals
{
  id: 1,
  title: "Goal Title",
  description: "Goal description",
  category: "Learning",
  priority: "high",
  deadline: "2024-06-15",
  progress: 75,
  status: "in-progress",
  milestones: [
    { id: 1, title: "Milestone 1", completed: true },
    { id: 2, title: "Milestone 2", completed: false }
  ]
}
```

## 🔒 Privacy & Security

- All data is stored locally in the browser
- No data is sent to external servers
- User privacy is maintained throughout the application
- Optional data export/import functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the Notion Life OS template
- Built with modern web technologies
- Designed for optimal user experience
- Focused on productivity and life optimization

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Life OS** - Transform your life with better organization and productivity! 🚀

