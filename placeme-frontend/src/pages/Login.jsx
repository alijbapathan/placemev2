import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuthStore } from '../context/authContext'
import { auth } from '../services/apiClient'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Login to get tokens
      const tokenRes = await auth.login(formData.username, formData.password)
      const { access, refresh } = tokenRes.data

      // Store tokens in localStorage for persistence across page reloads
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      // Fetch user profile
      try {
        const userRes = await auth.getProfile()
        login(userRes.data, access, refresh)
      } catch (err) {
        console.error('Error fetching profile:', err)
        login({ username: formData.username }, access, refresh)
      }

      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      const errorMsg = error.response?.data?.detail || 'Invalid username or password'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">PM</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PlaceMe</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username or Email
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 font-semibold disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Links */}
          <div className="flex justify-between items-center text-sm">
            <Link to="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
            <Link to="/register" className="text-gray-600 hover:text-blue-600">
              Create account
            </Link>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="bg-blue-50 rounded-xl p-4 mt-6 text-sm">
          <p className="font-semibold text-gray-900 mb-2">Demo Credentials:</p>
          <p className="text-gray-600">Username: <code className="bg-white px-2 py-1 rounded">student1</code></p>
          <p className="text-gray-600">Password: <code className="bg-white px-2 py-1 rounded">test123</code></p>
        </div>
      </div>
    </div>
  )
}

export default Login
