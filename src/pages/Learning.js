import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Filter,
  GraduationCap,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const Learning = () => {
  const [learningData, setLearningData] = useState({
    totalHours: 156,
    thisWeek: 12,
    thisMonth: 48,
    coursesCompleted: 8,
    currentCourses: 3,
    skillsLearned: 15,
    certificates: 5,
    courses: [
      {
        id: 1,
        title: 'React Fundamentals',
        platform: 'Udemy',
        instructor: 'Max Schwarzmüller',
        progress: 85,
        totalHours: 20,
        completedHours: 17,
        status: 'in-progress',
        category: 'Programming',
        rating: 4.8,
        startDate: '2024-03-15',
        lastStudied: '2024-05-07'
      },
      {
        id: 2,
        title: 'Advanced JavaScript',
        platform: 'Coursera',
        instructor: 'Dr. Sarah Johnson',
        progress: 100,
        totalHours: 15,
        completedHours: 15,
        status: 'completed',
        category: 'Programming',
        rating: 4.9,
        startDate: '2024-02-01',
        lastStudied: '2024-04-20'
      },
      {
        id: 3,
        title: 'UI/UX Design Principles',
        platform: 'Skillshare',
        instructor: 'Alex Chen',
        progress: 45,
        totalHours: 12,
        completedHours: 5.4,
        status: 'in-progress',
        category: 'Design',
        rating: 4.7,
        startDate: '2024-04-10',
        lastStudied: '2024-05-06'
      },
      {
        id: 4,
        title: 'Data Science Basics',
        platform: 'edX',
        instructor: 'Prof. Michael Brown',
        progress: 0,
        totalHours: 25,
        completedHours: 0,
        status: 'not-started',
        category: 'Data Science',
        rating: 4.6,
        startDate: '2024-05-15',
        lastStudied: null
      }
    ],
    skills: [
      { id: 1, name: 'React', level: 'Advanced', category: 'Programming' },
      { id: 2, name: 'JavaScript', level: 'Advanced', category: 'Programming' },
      { id: 3, name: 'UI Design', level: 'Intermediate', category: 'Design' },
      { id: 4, name: 'Python', level: 'Beginner', category: 'Programming' },
      { id: 5, name: 'Data Analysis', level: 'Beginner', category: 'Data Science' }
    ]
  });

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [filter, setFilter] = useState('all');

  const [newCourse, setNewCourse] = useState({
    title: '',
    platform: 'Udemy',
    instructor: '',
    category: 'Programming',
    totalHours: ''
  });

  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'Beginner',
    category: 'Programming'
  });

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.instructor || !newCourse.totalHours) {
      toast.error('Please fill in all required fields');
      return;
    }

    const course = {
      id: Date.now(),
      ...newCourse,
      progress: 0,
      completedHours: 0,
      status: 'not-started',
      rating: 0,
      startDate: new Date().toISOString().split('T')[0],
      lastStudied: null
    };

    setLearningData(prev => ({
      ...prev,
      courses: [...prev.courses, course],
      currentCourses: prev.currentCourses + 1
    }));

    setNewCourse({
      title: '',
      platform: 'Udemy',
      instructor: '',
      category: 'Programming',
      totalHours: ''
    });
    setShowAddCourse(false);
    toast.success('Course added successfully!');
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name) {
      toast.error('Please enter a skill name');
      return;
    }

    const skill = {
      id: Date.now(),
      ...newSkill
    };

    setLearningData(prev => ({
      ...prev,
      skills: [...prev.skills, skill],
      skillsLearned: prev.skillsLearned + 1
    }));

    setNewSkill({
      name: '',
      level: 'Beginner',
      category: 'Programming'
    });
    setShowAddSkill(false);
    toast.success('Skill added successfully!');
  };

  const handleUpdateProgress = (courseId, hours) => {
    setLearningData(prev => ({
      ...prev,
      courses: prev.courses.map(course => {
        if (course.id === courseId) {
          const newCompletedHours = Math.min(course.completedHours + hours, course.totalHours);
          const newProgress = Math.round((newCompletedHours / course.totalHours) * 100);
          const newStatus = newProgress === 100 ? 'completed' : 'in-progress';
          
          return {
            ...course,
            completedHours: newCompletedHours,
            progress: newProgress,
            status: newStatus,
            lastStudied: new Date().toISOString().split('T')[0]
          };
        }
        return course;
      }),
      totalHours: prev.totalHours + hours,
      thisWeek: prev.thisWeek + hours,
      thisMonth: prev.thisMonth + hours
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-700';
      case 'in-progress': return 'bg-primary-100 text-primary-700';
      case 'not-started': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Advanced': return 'bg-success-100 text-success-700';
      case 'Intermediate': return 'bg-warning-100 text-warning-700';
      case 'Beginner': return 'bg-primary-100 text-primary-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredCourses = learningData.courses.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'completed') return course.status === 'completed';
    if (filter === 'in-progress') return course.status === 'in-progress';
    if (filter === 'not-started') return course.status === 'not-started';
    return true;
  });

  const MetricCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {change && (
          <div className="flex items-center space-x-1">
            {change >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-success-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-danger-600" />
            )}
            <span className={`text-sm font-medium ${change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );

  const CourseCard = ({ course }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
            {course.rating > 0 && (
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{course.rating}</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-3">{course.instructor} • {course.platform}</p>
          <div className="flex items-center space-x-3 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
              {course.status.replace('-', ' ')}
            </span>
            <span className="text-xs text-gray-500">{course.category}</span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock size={12} />
              <span>{course.completedHours}/{course.totalHours}h</span>
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          {course.status === 'in-progress' && (
            <button
              onClick={() => handleUpdateProgress(course.id, 1)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              +1 Hour
            </button>
          )}
          <button
            onClick={() => handleUpdateProgress(course.id, 2)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            +2 Hours
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {course.lastStudied && `Last studied: ${new Date(course.lastStudied).toLocaleDateString()}`}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning & Growth</h1>
          <p className="text-gray-600 mt-1">Track your learning progress and skill development</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddSkill(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Award size={20} />
            <span>Add Skill</span>
          </button>
          <button
            onClick={() => setShowAddCourse(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Learning Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Hours"
          value={learningData.totalHours}
          change={15.3}
          icon={Clock}
          color="bg-primary-500"
          subtitle="Lifetime learning"
        />
        <MetricCard
          title="This Week"
          value={learningData.thisWeek}
          change={8.7}
          icon={TrendingUp}
          color="bg-success-500"
          subtitle="Hours studied"
        />
        <MetricCard
          title="Courses Completed"
          value={learningData.coursesCompleted}
          icon={CheckCircle}
          color="bg-warning-500"
          subtitle="Total completed"
        />
        <MetricCard
          title="Skills Learned"
          value={learningData.skillsLearned}
          change={12.5}
          icon={Award}
          color="bg-danger-500"
          subtitle="Total skills"
        />
      </div>

      {/* Skills Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Skills & Competencies</h2>
          <button
            onClick={() => setShowAddSkill(true)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Add Skill
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {learningData.skills.map((skill) => (
            <div key={skill.id} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <GraduationCap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1">{skill.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                {skill.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Courses</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Learning Streak */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Streak</h2>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gradient-to-br from-warning-400 to-warning-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">7</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 mb-2">You've been learning for 7 consecutive days!</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Streak</span>
                <span className="text-sm font-medium text-gray-900">7 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Longest Streak</span>
                <span className="text-sm font-medium text-gray-900">15 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Daily</span>
                <span className="text-sm font-medium text-gray-900">2.3 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Course</h2>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter course title"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select
                    value={newCourse.platform}
                    onChange={(e) => setNewCourse({ ...newCourse, platform: e.target.value })}
                    className="input-field"
                  >
                    <option value="Udemy">Udemy</option>
                    <option value="Coursera">Coursera</option>
                    <option value="edX">edX</option>
                    <option value="Skillshare">Skillshare</option>
                    <option value="Pluralsight">Pluralsight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input
                  type="text"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                  className="input-field"
                  placeholder="Enter instructor name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours</label>
                <input
                  type="number"
                  value={newCourse.totalHours}
                  onChange={(e) => setNewCourse({ ...newCourse, totalHours: e.target.value })}
                  className="input-field"
                  placeholder="0"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Course
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Skill</h2>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., React, Python"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                    className="input-field"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Skill
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSkill(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learning;
