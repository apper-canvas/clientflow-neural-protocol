import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold text-surface-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-surface-700 mb-2">Page Not Found</h2>
        <p className="text-surface-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl shadow-card hover:shadow-lg transition-all duration-300 font-medium"
        >
          <ApperIcon name="Home" className="h-5 w-5" />
          <span>Go Home</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound