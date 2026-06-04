import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import { StudentDashboard } from './pages/StudentDashboard'
import TPODashboard from './pages/tpo/tpoDashboard'
import TPOCompanies from './pages/tpo/companies'
import CompanyForm from './pages/tpo/companyForm'
import EditCompany from './pages/tpo/EditCompany'
import Drives from './pages/tpo/Drives'
import DriveForm from './pages/tpo/DriveForm'
import EditDrive from './pages/tpo/EditDrive'
import TPOApplications from './pages/tpo/applications'
import ApplicationDetails from './pages/tpo/applicationDetails'
import TpoCourses from './pages/tpo/tpoCourses'
import CourseForm from './pages/tpo/courseForm'
import EditCourse from './pages/tpo/EditCourse'
import TpoMockTests from './pages/tpo/TpoMockTests'
import MockTestForm from './pages/tpo/MockTestForm'
import EditMockTest from './pages/tpo/EditMockTest'
import Students from './pages/tpo/students'
import TpoEnrollments from './pages/tpo/TpoEnrollments'
import TpoTestAttempts from './pages/tpo/TpoTestAttempts'
import TPOProfile from './pages/tpo/tpoProfile'
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
import TPOLayout from './layouts/TPOLayout'

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

            {/* TPO routes */}
            <Route element={<TPOLayout />} path="/tpo">
              <Route index element={<TPODashboard />} />
              <Route path="profile" element={<TPOProfile />} />

              {/* Companies */}
              <Route path="companies" element={<TPOCompanies />} />
              <Route path="companies/create" element={<CompanyForm />} />
              <Route path="companies/edit/:id" element={<EditCompany />} />

              {/* Drives */}
              <Route path="drives" element={<Drives />} />
              <Route path="drives/create" element={<DriveForm />} />
              <Route path="drives/edit/:id" element={<EditDrive />} />

              {/* Applications */}
              <Route path="applications" element={<TPOApplications />} />
              <Route path="applications/:id" element={<ApplicationDetails />} />

              {/* Courses */}
              <Route path="courses" element={<TpoCourses />} />
              <Route path="courses/create" element={<CourseForm />} />
              <Route path="courses/edit/:id" element={<EditCourse />} />

              {/* Mock Tests */}
              <Route path="mock-tests" element={<TpoMockTests />} />
              <Route path="mock-tests/create" element={<MockTestForm />} />
              <Route path="mock-tests/edit/:id" element={<EditMockTest />} />

              {/* Students & reports */}
              <Route path="students" element={<Students />} />
              <Route path="enrollments" element={<TpoEnrollments />} />
              <Route path="attempts" element={<TpoTestAttempts />} />
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
