import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../context/authContext'
import { auth } from '../services/apiClient'
import { 
  BellIcon, 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

const Navbar = () => {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const res = await auth.getProfile()
      setUser(res.data)
    } catch (err) {
      console.error('Error fetching user profile:', err)
    } finally {
      setLoadingUser(false)
    }
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">PM</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">PlaceMe</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link to="/placement-drives" className="text-gray-700 hover:text-blue-600 font-medium">
              Drives
            </Link>
            <Link to="/mock-tests" className="text-gray-700 hover:text-blue-600 font-medium">
              Tests
            </Link>
            <Link to="/applications" className="text-gray-700 hover:text-blue-600 font-medium">
              Applications
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Notifications */}
            <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-blue-600">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                <UserCircleIcon className="w-6 h-6 text-gray-600" />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  {loadingUser ? 'Loading...' : (user?.first_name || user?.username || 'User')}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg flex items-center space-x-2"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link 
              to="/dashboard" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Dashboard
            </Link>
            <Link 
              to="/placement-drives" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Placement Drives
            </Link>
            <Link 
              to="/mock-tests" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Mock Tests
            </Link>
            <Link 
              to="/applications" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Applications
            </Link>
            <Link 
              to="/profile" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
