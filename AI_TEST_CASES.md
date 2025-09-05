# AI-Powered Task Form - Test Cases

## 🎯 **Enhanced AI Intelligence Test Cases**

### **Test Case 1: Complex Meeting Task**
**Input:** "Schedule a weekly team meeting every Monday at 9 AM - it's urgent and related to the Light the World project, should take 1 hour, and remind me 15 minutes before"

**Expected AI Suggestions:**
- 🔥 Set as Critical Priority (95% confidence) - "Detected urgency indicators"
- 📅 Use Meeting Icon (90% confidence) - "Detected meeting/scheduling"
- 📝 Link to Light the World Project (92% confidence) - "Detected project-specific keywords"
- 📅 Make this a Weekly Task (85% confidence) - "Detected weekly recurrence"
- 🔄 Set Weekly Recurrence Pattern (85% confidence) - "Detected weekly recurrence"
- ⏱️ Set 1 Hour Estimate (93% confidence) - "Detected time estimate"
- ⏰ Add Time Reminder (80% confidence) - "Detected reminder request"
- 🏷️ Add Tags: urgent, meeting, collaboration (82% confidence) - "Detected relevant tags"

### **Test Case 2: Health & Fitness Task**
**Input:** "Go to the gym for a workout session every day this week - it's important for my health goals, should take 2 hours each time"

**Expected AI Suggestions:**
- ⭐ Set as High Priority (85% confidence) - "Detected importance indicators"
- 💪 Assign to Health & Fitness (88% confidence) - "Detected health-related keywords"
- 📅 Make this a Daily Task (87% confidence) - "Detected daily recurrence"
- 🔄 Set Daily Recurrence Pattern (87% confidence) - "Detected daily recurrence"
- ⏱️ Set 2 Hour Estimate (93% confidence) - "Detected time estimate"
- 🏷️ Add Tags: important, planning (82% confidence) - "Detected relevant tags"

### **Test Case 3: Family & Cooking Task**
**Input:** "Plan and cook weekly family dinner every Sunday evening - this is for the Family Table project, should take 3 hours including prep time"

**Expected AI Suggestions:**
- 🍳 Link to Family Table Project (89% confidence) - "Detected family/cooking keywords"
- 👨‍👩‍👧‍👦 Assign to Family Life Area (87% confidence) - "Detected family-related keywords"
- 📅 Make this a Weekly Task (85% confidence) - "Detected weekly recurrence"
- 🔄 Set Weekly Recurrence Pattern (85% confidence) - "Detected weekly recurrence"
- ⏱️ Set 3 Hour Estimate (93% confidence) - "Detected time estimate"
- 🏷️ Add Tags: planning, milestone (82% confidence) - "Detected relevant tags"

### **Test Case 4: Work & Career Task**
**Input:** "Call Sarah about the project proposal tomorrow morning at 10 AM - it's crucial for our career goals, should take 30 minutes"

**Expected AI Suggestions:**
- ⭐ Set as High Priority (85% confidence) - "Detected importance indicators"
- 💼 Assign to Career Life Area (90% confidence) - "Detected work-related keywords"
- 👤 Assign to Sarah Smith (88% confidence) - "Detected assignee name"
- 📞 Use Phone Icon (88% confidence) - "Detected phone call activity"
- ⏱️ Set 0.5 Hour Estimate (93% confidence) - "Detected time estimate"
- 🏷️ Add Tags: important, call, collaboration (82% confidence) - "Detected relevant tags"

### **Test Case 5: Research & Learning Task**
**Input:** "Research new tools for the Light the World project - this is for my personal growth, should take 4 hours over the next few days"

**Expected AI Suggestions:**
- 📝 Link to Light the World Project (92% confidence) - "Detected project-specific keywords"
- 🌱 Assign to Personal Growth (85% confidence) - "Detected learning-related keywords"
- 🔍 Use Research Icon (85% confidence) - "Detected research activity"
- ⏱️ Set 4 Hour Estimate (93% confidence) - "Detected time estimate"
- 🏷️ Add Tags: research, planning (82% confidence) - "Detected relevant tags"

### **Test Case 6: Financial Task**
**Input:** "Review monthly budget and investment portfolio - this is important for my finances, should take 2 hours on Saturday"

**Expected AI Suggestions:**
- ⭐ Set as High Priority (85% confidence) - "Detected importance indicators"
- 💰 Assign to Finances (86% confidence) - "Detected finance-related keywords"
- 📋 Use Review Icon (86% confidence) - "Detected review activity"
- ⏱️ Set 2 Hour Estimate (93% confidence) - "Detected time estimate"
- 🏷️ Add Tags: important, review, milestone (82% confidence) - "Detected relevant tags"

### **Test Case 7: Home Improvement Task**
**Input:** "Start kitchen renovation project - this is for the Home Renovation project, should take 8 hours over the weekend"

**Expected AI Suggestions:**
- 🏠 Link to Home Renovation Project (87% confidence) - "Detected home improvement keywords"
- 🏠 Assign to Home Life Area (87% confidence) - "Detected family-related keywords"
- ⏱️ Set 8 Hour Estimate (93% confidence) - "Detected time estimate"
- 🏷️ Add Tags: planning, milestone (82% confidence) - "Detected relevant tags"

### **Test Case 8: Low Priority Task**
**Input:** "Organize old photos when possible - this is not urgent but would be nice to do someday"

**Expected AI Suggestions:**
- 🌱 Set as Low Priority (80% confidence) - "Detected low priority indicators"
- 🏷️ Add Tags: planning (82% confidence) - "Detected relevant tags"

### **Test Case 9: Location-Based Task**
**Input:** "Pick up dry cleaning at the mall location on my way home from work"

**Expected AI Suggestions:**
- 📍 Set Location: mall (75% confidence) - "Detected location reference"
- 🏷️ Add Tags: planning (82% confidence) - "Detected relevant tags"

### **Test Case 10: Complex Multi-Faceted Task**
**Input:** "Schedule monthly review meeting with Mike Johnson every first Monday at 2 PM - it's urgent for our career development, should take 1.5 hours, and remind me 30 minutes before"

**Expected AI Suggestions:**
- 🔥 Set as Critical Priority (95% confidence) - "Detected urgency indicators"
- 💼 Assign to Career Life Area (90% confidence) - "Detected work-related keywords"
- 👤 Assign to Mike Johnson (88% confidence) - "Detected assignee name"
- 📅 Use Meeting Icon (90% confidence) - "Detected meeting/scheduling"
- 📅 Make this a Monthly Task (84% confidence) - "Detected monthly recurrence"
- ⏱️ Set 1.5 Hour Estimate (93% confidence) - "Detected time estimate"
- ⏰ Add Time Reminder (80% confidence) - "Detected reminder request"
- 🏷️ Add Tags: urgent, meeting, collaboration, milestone (82% confidence) - "Detected relevant tags"

## 🧪 **Testing Instructions**

1. **Navigate to `/new-task`** in the Life OS application
2. **Enter each test case** in the natural language input field
3. **Click "Analyze with AI"** to process the input
4. **Review AI suggestions** in Stage 2 with confidence levels and reasoning
5. **Select/dismiss suggestions** as appropriate
6. **Continue to review** to see applied suggestions in Stage 3
7. **Verify accuracy** of AI detection and confidence levels

## 🎯 **Expected Results**

- **High Confidence (90%+)** suggestions should be very accurate
- **Medium Confidence (70-89%)** suggestions should be mostly accurate
- **Low Confidence (<70%)** suggestions should be reviewed carefully
- **All suggestions** should include clear reasoning
- **User control** should allow applying/dismissing individual suggestions
- **Progressive disclosure** should make the interface manageable

## 🚀 **Success Criteria**

✅ **AI accurately detects** priority, life areas, projects, recurrence, time estimates
✅ **Confidence levels** are appropriate and helpful
✅ **Reasoning is clear** and understandable
✅ **User has full control** over suggestion application
✅ **Interface is intuitive** and follows best practices
✅ **Performance is smooth** with 2-second processing time
✅ **No ESLint warnings** in the console

---

**Ready to test the sophisticated AI-powered task creation system! 🎯**
