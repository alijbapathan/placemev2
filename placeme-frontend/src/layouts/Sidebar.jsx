import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { SIDEBAR_ITEMS } from '../constants/dummyData'
import { useAuthStore } from '../context/authContext'

export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const containerVariants = {
    initial: { x: -300 },
    animate: { x: 0 },
    exit: { x: -300 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className={`${
        isCollapsed ? 'w-24' : 'w-72'
      } fixed left-0 top-0 h-screen bg-white border-r border-slate-200 backdrop-blur-xl z-40 transition-all duration-300 flex flex-col`}
    >
      {/* Logo Section */}
      <div className={`flex items-center gap-3 px-6 py-8 border-b border-slate-200 ${isCollapsed && 'justify-center'}`}>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">PM</span>
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-slate-900">PlaceMe</h1>
            <p className="text-xs text-slate-500">Student Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {SIDEBAR_ITEMS.map((item, index) => {
          const IconComponent = Icons[item.icon]
          const isActive = location.pathname === item.path

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(item.path)}
              className={`w-full relative group overflow-hidden rounded-lg px-4 py-3 transition-all duration-200 flex items-center gap-3 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-100 -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              <IconComponent className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            </motion.button>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-slate-200 p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full rounded-lg bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 text-sm font-medium hover:bg-red-100 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Icons.LogOut className={`w-5 h-5 ${isCollapsed && 'w-4 h-4'}`} />
          {!isCollapsed && 'Logout'}
        </motion.button>
      </div>

      {/* Collapse Toggle */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileHover={{ scale: 1.1 }}
        className="absolute -right-4 bottom-24 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
      >
        <Icons.ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed && 'rotate-180'}`} />
      </motion.button>
    </motion.div>
  )
}
