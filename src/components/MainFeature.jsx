import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('contacts')
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Initialize with sample data
  useEffect(() => {
    setContacts([
      {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1 (555) 123-4567',
        company: 'TechCorp Solutions',
        position: 'VP of Sales',
        tags: ['Enterprise', 'Hot Lead'],
        createdAt: new Date(),
        lastContactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'm.chen@startupxyz.io',
        phone: '+1 (555) 987-6543',
        company: 'StartupXYZ',
        position: 'CTO',
        tags: ['Startup', 'Tech'],
        createdAt: new Date(),
        lastContactDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ])

    setDeals([
      {
        id: '1',
        title: 'TechCorp Enterprise License',
        contactId: '1',
        value: 150000,
        stage: 'Proposal',
        probability: 75,
        expectedCloseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        description: 'Annual enterprise software license for 500 users',
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'StartupXYZ Implementation',
        contactId: '2',
        value: 45000,
        stage: 'Discovery',
        probability: 40,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: 'Custom implementation and training package',
        createdAt: new Date()
      }
    ])

    setActivities([
      {
        id: '1',
        type: 'Call',
        title: 'Follow-up call with Sarah',
        description: 'Discuss proposal timeline and requirements',
        contactId: '1',
        dealId: '1',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        completed: false,
        createdAt: new Date()
      },
      {
        id: '2',
        type: 'Email',
        title: 'Send technical documentation',
        description: 'Share API documentation and integration guides',
        contactId: '2',
        dealId: '2',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        completed: false,
        createdAt: new Date()
      }
    ])
  }, [])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    tags: ''
  })

  const handleAddContact = (e) => {
    e.preventDefault()
    const newContact = {
      id: Date.now().toString(),
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      lastContactDate: new Date()
    }
    setContacts([...contacts, newContact])
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      tags: ''
    })
    setShowForm(false)
    toast.success('Contact added successfully!')
  }

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStageColor = (stage) => {
    const stageColors = {
      'Discovery': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Qualification': 'bg-blue-100 text-blue-800 border-blue-200',
      'Proposal': 'bg-purple-100 text-purple-800 border-purple-200',
      'Negotiation': 'bg-orange-100 text-orange-800 border-orange-200',
      'Closed Won': 'bg-green-100 text-green-800 border-green-200',
      'Closed Lost': 'bg-red-100 text-red-800 border-red-200'
    }
    return stageColors[stage] || 'bg-surface-100 text-surface-800 border-surface-200'
  }

  const tabs = [
    { id: 'contacts', label: 'Contacts', icon: 'Users', count: contacts.length },
    { id: 'deals', label: 'Deals', icon: 'TrendingUp', count: deals.length },
    { id: 'activities', label: 'Activities', icon: 'CheckSquare', count: activities.filter(a => !a.completed).length }
  ]

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-card border border-surface-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
              Customer Relationship Management
            </h2>
            <p className="text-surface-600 text-sm sm:text-base">
              Manage your contacts, track deals, and streamline your sales process
            </p>
          </div>
          
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 sm:px-6 py-3 rounded-xl shadow-card hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="Plus" className="h-5 w-5" />
            <span className="font-medium">Add Contact</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Add Contact Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-card border border-surface-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl input-focus transition-colors"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl input-focus transition-colors"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl input-focus transition-colors"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl input-focus transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl input-focus transition-colors"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl input-focus transition-colors"
                    placeholder="Enter job title"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl input-focus transition-colors"
                  placeholder="e.g., Enterprise, Hot Lead, Tech"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl shadow-card hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Add Contact
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 sm:flex-initial neu-button px-6 py-3 rounded-xl text-surface-700 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Navigation */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-card border border-surface-200">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-card'
                  : 'text-surface-600 hover:bg-surface-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ApperIcon name={tab.icon} className="h-5 w-5" />
              <span className="font-medium hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">{tab.label.slice(0, 4)}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-surface-200 text-surface-700'
              }`}>
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      {activeTab === 'contacts' && (
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-card border border-surface-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search contacts by name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl input-focus transition-colors"
            />
          </div>
        </motion.div>
      )}

      {/* Content Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'contacts' && (
          <motion.div
            key="contacts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-card border border-surface-200 card-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-3 rounded-xl">
                      <ApperIcon name="User" className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-surface-900 truncate">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-surface-600 text-sm">{contact.position} at {contact.company}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center space-x-1 text-xs text-surface-600">
                          <ApperIcon name="Mail" className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{contact.email}</span>
                        </span>
                        {contact.phone && (
                          <span className="inline-flex items-center space-x-1 text-xs text-surface-600">
                            <ApperIcon name="Phone" className="h-3 w-3" />
                            <span>{contact.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-surface-500">
                      Last contact: {contact.lastContactDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredContacts.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ApperIcon name="UserX" className="h-12 w-12 text-surface-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No contacts found</h3>
                <p className="text-surface-600">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Add your first contact to get started'}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'deals' && (
          <motion.div
            key="deals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {deals.map((deal, index) => {
              const contact = contacts.find(c => c.id === deal.contactId)
              return (
                <motion.div
                  key={deal.id}
                  className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-card border border-surface-200 card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-3 rounded-xl">
                        <ApperIcon name="TrendingUp" className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-surface-900">{deal.title}</h3>
                        <p className="text-surface-600 text-sm mb-2">{deal.description}</p>
                        {contact && (
                          <p className="text-surface-500 text-sm">
                            Contact: {contact.firstName} {contact.lastName} at {contact.company}
                          </p>
                        )}
                        <p className="text-surface-500 text-xs mt-1">
                          Expected close: {deal.expectedCloseDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-surface-900">
                          {formatCurrency(deal.value)}
                        </div>
                        <div className="text-sm text-surface-600">
                          {deal.probability}% probability
                        </div>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(deal.stage)}`}>
                        {deal.stage}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {activeTab === 'activities' && (
          <motion.div
            key="activities"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {activities.map((activity, index) => {
              const contact = contacts.find(c => c.id === activity.contactId)
              const deal = deals.find(d => d.id === activity.dealId)
              return (
                <motion.div
                  key={activity.id}
                  className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-card border border-surface-200 card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${activity.completed ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <ApperIcon 
                        name={activity.type === 'Call' ? 'Phone' : activity.type === 'Email' ? 'Mail' : 'Calendar'} 
                        className={`h-6 w-6 ${activity.completed ? 'text-green-600' : 'text-yellow-600'}`} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="text-lg font-semibold text-surface-900">{activity.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          activity.completed 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {activity.type}
                        </span>
                      </div>
                      <p className="text-surface-600 text-sm mb-2">{activity.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-surface-500">
                        {contact && (
                          <span>Contact: {contact.firstName} {contact.lastName}</span>
                        )}
                        {deal && (
                          <span>Deal: {deal.title}</span>
                        )}
                        <span>Due: {activity.dueDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature