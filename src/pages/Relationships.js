import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Phone,
  Mail,
  Calendar,
  Heart,
  Star,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Gift,
  Coffee
} from 'lucide-react';
import toast from 'react-hot-toast';

const Relationships = () => {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      category: 'Family',
      relationship: 'Sister',
      lastContact: '2024-05-06',
      nextFollowUp: '2024-05-15',
      interactions: [
        { id: 1, type: 'Call', date: '2024-05-06', notes: 'Caught up on family news' },
        { id: 2, type: 'Text', date: '2024-05-01', notes: 'Birthday wishes' },
        { id: 3, type: 'Coffee', date: '2024-04-25', notes: 'Met for coffee downtown' }
      ],
      notes: 'Loves hiking and photography. Planning a family trip in June.',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      phone: '+1 (555) 987-6543',
      category: 'Work',
      relationship: 'Colleague',
      lastContact: '2024-05-07',
      nextFollowUp: '2024-05-12',
      interactions: [
        { id: 1, type: 'Meeting', date: '2024-05-07', notes: 'Project planning meeting' },
        { id: 2, type: 'Email', date: '2024-05-03', notes: 'Sent project updates' },
        { id: 3, type: 'Lunch', date: '2024-04-28', notes: 'Team lunch' }
      ],
      notes: 'Great collaborator on the new product launch. Loves sushi.',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
      category: 'Friends',
      relationship: 'Close Friend',
      lastContact: '2024-05-05',
      nextFollowUp: '2024-05-20',
      interactions: [
        { id: 1, type: 'Dinner', date: '2024-05-05', notes: 'Celebrated her promotion' },
        { id: 2, type: 'Text', date: '2024-05-02', notes: 'Checked in on her interview' },
        { id: 3, type: 'Call', date: '2024-04-30', notes: 'Long catch-up call' }
      ],
      notes: 'Best friend from college. Always supportive and fun to be around.',
      priority: 'high'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@startup.com',
      phone: '+1 (555) 321-0987',
      category: 'Networking',
      relationship: 'Mentor',
      lastContact: '2024-04-20',
      nextFollowUp: '2024-05-25',
      interactions: [
        { id: 1, type: 'Coffee', date: '2024-04-20', notes: 'Career advice session' },
        { id: 2, type: 'Email', date: '2024-04-15', notes: 'Thank you for introduction' },
        { id: 3, type: 'Call', date: '2024-04-10', notes: 'Initial mentorship call' }
      ],
      notes: 'Experienced entrepreneur. Great mentor for business advice.',
      priority: 'medium'
    }
  ]);

  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState('all');

  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Friends',
    relationship: '',
    notes: ''
  });

  const [newInteraction, setNewInteraction] = useState({
    type: 'Call',
    notes: ''
  });

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const contact = {
      id: Date.now(),
      ...newContact,
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      interactions: [],
      priority: 'medium'
    };

    setContacts([...contacts, contact]);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      category: 'Friends',
      relationship: '',
      notes: ''
    });
    setShowAddContact(false);
    toast.success('Contact added successfully!');
  };

  const handleAddInteraction = (contactId) => {
    if (!newInteraction.notes) {
      toast.error('Please add notes for the interaction');
      return;
    }

    const interaction = {
      id: Date.now(),
      ...newInteraction,
      date: new Date().toISOString().split('T')[0]
    };

    setContacts(contacts.map(contact => {
      if (contact.id === contactId) {
        return {
          ...contact,
          interactions: [interaction, ...contact.interactions],
          lastContact: new Date().toISOString().split('T')[0]
        };
      }
      return contact;
    }));

    setNewInteraction({
      type: 'Call',
      notes: ''
    });
    setShowAddInteraction(false);
    toast.success('Interaction logged successfully!');
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Family': return 'bg-purple-100 text-purple-700';
      case 'Work': return 'bg-blue-100 text-blue-700';
      case 'Friends': return 'bg-green-100 text-green-700';
      case 'Networking': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-danger-100 text-danger-700';
      case 'medium': return 'bg-warning-100 text-warning-700';
      case 'low': return 'bg-success-100 text-success-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'Call': return <Phone size={16} />;
      case 'Text': return <MessageCircle size={16} />;
      case 'Email': return <Mail size={16} />;
      case 'Meeting': return <Calendar size={16} />;
      case 'Coffee': return <Coffee size={16} />;
      case 'Dinner': return <Heart size={16} />;
      case 'Lunch': return <Coffee size={16} />;
      default: return <MessageCircle size={16} />;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    if (filter === 'family') return contact.category === 'Family';
    if (filter === 'work') return contact.category === 'Work';
    if (filter === 'friends') return contact.category === 'Friends';
    if (filter === 'networking') return contact.category === 'Networking';
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

  const ContactCard = ({ contact }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
            {contact.priority === 'high' && <Star size={16} className="text-danger-500 fill-current" />}
          </div>
          <p className="text-gray-600 text-sm mb-3">{contact.relationship} • {contact.email}</p>
          <div className="flex items-center space-x-3 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(contact.category)}`}>
              {contact.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
              {contact.priority}
            </span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Phone size={12} />
              <span>{contact.phone}</span>
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Contact Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Last Contact</span>
          <span className="text-gray-900">{new Date(contact.lastContact).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Next Follow-up</span>
          <span className="text-gray-900">{new Date(contact.nextFollowUp).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Recent Interactions */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Interactions</h4>
        <div className="space-y-2">
          {contact.interactions.slice(0, 2).map((interaction) => (
            <div key={interaction.id} className="flex items-center space-x-2 text-sm">
              <div className="p-1 bg-gray-100 rounded">
                {getInteractionIcon(interaction.type)}
              </div>
              <span className="text-gray-700">{interaction.type}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">{new Date(interaction.date).toLocaleDateString()}</span>
            </div>
          ))}
          {contact.interactions.length > 2 && (
            <p className="text-xs text-gray-500">+{contact.interactions.length - 2} more interactions</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setSelectedContact(contact);
              setShowAddInteraction(true);
            }}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Log Interaction
          </button>
          <button
            onClick={() => setSelectedContact(contact)}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            View Details
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Phone size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Mail size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relationships</h1>
          <p className="text-gray-600 mt-1">Manage your contacts and track important relationships</p>
        </div>
        <button
          onClick={() => setShowAddContact(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Relationship Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contacts"
          value={contacts.length}
          change={12.5}
          icon={Users}
          color="bg-primary-500"
          subtitle="All relationships"
        />
        <MetricCard
          title="This Week"
          value={contacts.filter(c => {
            const lastContact = new Date(c.lastContact);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return lastContact >= weekAgo;
          }).length}
          change={8.7}
          icon={MessageCircle}
          color="bg-success-500"
          subtitle="Contacts reached"
        />
        <MetricCard
          title="Due Follow-ups"
          value={contacts.filter(c => {
            const nextFollowUp = new Date(c.nextFollowUp);
            const today = new Date();
            return nextFollowUp <= today;
          }).length}
          icon={AlertCircle}
          color="bg-warning-500"
          subtitle="Overdue contacts"
        />
        <MetricCard
          title="High Priority"
          value={contacts.filter(c => c.priority === 'high').length}
          change={15.3}
          icon={Star}
          color="bg-danger-500"
          subtitle="Important contacts"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">
            <div className="p-3 rounded-lg bg-primary-500 mb-3 group-hover:scale-110 transition-transform duration-200">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Call Contact</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">
            <div className="p-3 rounded-lg bg-success-500 mb-3 group-hover:scale-110 transition-transform duration-200">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Send Email</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">
            <div className="p-3 rounded-lg bg-warning-500 mb-3 group-hover:scale-110 transition-transform duration-200">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Schedule Coffee</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">
            <div className="p-3 rounded-lg bg-danger-500 mb-3 group-hover:scale-110 transition-transform duration-200">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Send Gift</span>
          </button>
        </div>
      </div>

      {/* Contacts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Contacts</h2>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Contacts</option>
              <option value="family">Family</option>
              <option value="work">Work</option>
              <option value="friends">Friends</option>
              <option value="networking">Networking</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Contact</h2>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="input-field"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newContact.category}
                    onChange={(e) => setNewContact({ ...newContact, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Family">Family</option>
                    <option value="Work">Work</option>
                    <option value="Friends">Friends</option>
                    <option value="Networking">Networking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Colleague, Friend"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newContact.notes}
                  onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Add any notes about this contact"
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Contact
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Interaction Modal */}
      {showAddInteraction && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Interaction with {selectedContact.name}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddInteraction(selectedContact.id);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interaction Type</label>
                <select
                  value={newInteraction.type}
                  onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value })}
                  className="input-field"
                >
                  <option value="Call">Call</option>
                  <option value="Text">Text</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Lunch">Lunch</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newInteraction.notes}
                  onChange={(e) => setNewInteraction({ ...newInteraction, notes: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="What did you discuss?"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Log Interaction
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddInteraction(false);
                    setSelectedContact(null);
                  }}
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

export default Relationships;
