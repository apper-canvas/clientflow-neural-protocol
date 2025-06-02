import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-lg border-b border-surface-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl shadow-card">
                <ApperIcon name="Users" className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">ClientFlow</h1>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="neu-button p-2 rounded-xl hover:bg-surface-200 transition-colors"
            >
              <ApperIcon 
                name={darkMode ? "Sun" : "Moon"} 
                className="h-5 w-5 text-surface-600" 
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MainFeature />
      </main>

      {/* Stats Footer */}
      <motion.footer 
        className="mt-12 sm:mt-16 bg-white/60 backdrop-blur-sm border-t border-surface-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Active Contacts", value: "1,247", icon: "UserCheck" },
              { label: "Deals Closed", value: "$2.4M", icon: "TrendingUp" },
              { label: "Tasks Today", value: "23", icon: "CheckSquare" },
              { label: "Pipeline Value", value: "$890K", icon: "DollarSign" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                  <ApperIcon name={stat.icon} className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-surface-900">{stat.value}</div>
                <div className="text-sm text-surface-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home