import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../context/authContext'
import {
  SparklesIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

const Home = () => {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  if (isAuthenticated) {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">PM</span>
            </div>
            <span className="text-xl font-bold">PlaceMe</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <span className="inline-flex items-center space-x-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-medium">
            <SparklesIcon className="w-4 h-4" />
            <span>Smart Placement & Training Management Portal</span>
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Your Placement Journey
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
            Starts Here
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Connect students with opportunities. Streamline your training and placement process with PlaceMe.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
          <Link to="/login" className="btn-outline text-lg px-8 py-3">
            Sign In
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <AcademicCapIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">For Students</h3>
            <p className="text-gray-600">
              Apply to drives, take mock tests, track your progress, and get placed.
            </p>
          </div>

          <div className="card">
            <UserGroupIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">For Recruiters</h3>
            <p className="text-gray-600">
              Post drives, filter candidates, schedule interviews, and hire talent.
            </p>
          </div>

          <div className="card">
            <CheckCircleIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">For TPO</h3>
            <p className="text-gray-600">
              Manage drives, verify companies, track placements, and get insights.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: '📊 Dashboard', desc: 'Real-time analytics and insights' },
              { title: '🎯 Placement Drives', desc: 'Browse and apply to opportunities' },
              { title: '✅ Mock Tests', desc: 'Aptitude, verbal, technical tests' },
              { title: '📧 Notifications', desc: 'Real-time updates and announcements' },
              { title: '🎓 Training Courses', desc: 'Enroll in skill development courses' },
              { title: '📄 Application Tracking', desc: 'Track your applications status' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-4">
                <div className="flex-shrink-0 text-2xl">{feature.title.split(' ')[0]}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title.split(' ').slice(1).join(' ')}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of students and recruiters using PlaceMe to connect and succeed.
          </p>
          <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 PlaceMe. All rights reserved.</p>
          <p className="mt-2 text-sm">Smart Placement & Training Management Portal for Colleges</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
