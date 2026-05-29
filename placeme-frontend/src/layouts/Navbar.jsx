import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { NOTIFICATIONS } from '../constants/dummyData'
import { Badge } from '../components/Badge'
import { useAuthStore } from '../context/authContext'
import { auth } from '../services/apiClient'

export const Navbar = () => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await auth.getProfile()
        setUser(res.data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const unreadNotifications = NOTIFICATIONS.filter(n => !n.read).length
  const userName = user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'Student'
  const userEmail = user?.email || 'student@example.com'
  const userBranch = user?.branch || 'Computer Science'
  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-72 right-0 h-20 bg-white backdrop-blur-xl border-b border-slate-200 z-30 flex items-center justify-between px-8"
    >
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all duration-200"
        />
        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-8">
        {/* Notifications */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Icons.Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
              />
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-96 overflow-y-auto"
            >
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-slate-900 font-semibold">Notifications</h3>
              </div>
              <div className="divide-y divide-slate-200">
                {NOTIFICATIONS.slice(0, 5).map((notification) => (
                  <motion.div
                    key={notification.id}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
                    className="p-4 cursor-pointer"
                  >
                    <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{notification.timestamp}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-300" />

        {/* Profile */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src={userAvatar}
              alt={userName}
              className="w-9 h-9 rounded-full border border-indigo-500"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-600">{userBranch}</p>
            </div>
            <Icons.ChevronDown className="w-4 h-4 text-slate-600" />
          </motion.button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-900">{userName}</p>
                <p className="text-xs text-slate-600">{userEmail}</p>
              </div>
              <div className="p-2">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
                  onClick={() => navigate('/settings')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Icons.Settings className="w-4 h-4" />
                  Settings
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-700 rounded-lg transition-colors flex items-center gap-2 mt-2"
                >
                  <Icons.LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
