import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import { StudentDashboard } from './pages/StudentDashboard'
import { Profile } from './pages/Profile'
import { PlacementDrives } from './pages/PlacementDrives'
import { Applications } from './pages/Applications'
import { MockTests } from './pages/MockTests'
import { InterviewExperience } from './pages/InterviewExperience'
import { ResumeBuilder } from './pages/ResumeBuilder'
import { NotificationsPage } from './pages/Notifications'
import { Settings } from './pages/Settings'
import { Training } from './pages/Training'

// Components & Layouts
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import { MainLayout } from './layouts/MainLayout'

function App() {
  // Check localStorage directly for login status
  // Auth store might not be hydrated on first load
  const hasToken = localStorage.getItem('access_token')

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={hasToken ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={hasToken ? <Navigate to="/dashboard" /> : <Register />} />

          {/* Protected Routes with MainLayout */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/drives" element={<PlacementDrives />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/mock-tests" element={<MockTests />} />
              <Route path="/interviews" element={<InterviewExperience />} />
              <Route path="/resume" element={<ResumeBuilder />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/training" element={<Training />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <ToastContainer 
        position="bottom-right" 
        autoClose={3000}
        theme="dark"
      />
    </Router>
  )
}

export default App
