import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { DashboardCard } from '../components/DashboardCard'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { auth, placement, training } from '../services/apiClient'
import { NOTIFICATIONS, ACTIVITY_TIMELINE, AI_SUGGESTIONS, MOCK_TESTS } from '../constants/dummyData'

export const StudentDashboard = () => {
  const [animateCounters, setAnimateCounters] = useState(false)
  const [user, setUser] = useState(null)
  const [drives, setDrives] = useState([])
  const [stats, setStats] = useState({
    appliedDrives: 0,
    upcomingDrives: 0,
    resumeScore: 0,
    testsCompleted: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    setAnimateCounters(true)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch user profile
      try {
        const userRes = await auth.getProfile()
        console.log('User profile:', userRes.data)
        setUser(userRes.data)
      } catch (err) {
        console.error('Error fetching user profile:', err)
      }

      // Fetch applications count
      try {
        const appsRes = await placement.getMyApplications({ page_size: 1 })
        const appliedCount = appsRes.data?.count || 0
        console.log('Applications count:', appliedCount)
        setStats(prev => ({ ...prev, appliedDrives: appliedCount }))
      } catch (err) {
        console.error('Error fetching applications:', err)
      }

      // Fetch upcoming drives
      try {
        const drivesRes = await placement.getDrives({ is_active: true })
        const drivesData = Array.isArray(drivesRes.data) ? drivesRes.data : drivesRes.data?.results || []
        console.log('Upcoming drives:', drivesData)
        setDrives(drivesData)
        setStats(prev => ({ ...prev, upcomingDrives: drivesData.length }))
      } catch (err) {
        console.error('Error fetching drives:', err)
      }

      // Fetch tests completed
      try {
        const testsRes = await training.getMyAttempts({ page_size: 1 })
        const testsCount = testsRes.data?.count || 0
        console.log('Tests completed count:', testsCount)
        setStats(prev => ({ ...prev, testsCompleted: testsCount }))
      } catch (err) {
        console.error('Error fetching tests:', err)
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  const userName = user?.first_name || user?.username || 'Student'

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome back, {userName} 👋</h1>
        <p className="text-slate-600">Here's your recruitment dashboard snapshot</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={Icons.Briefcase}
            label="Applied Drives"
            value={stats.appliedDrives}
            trend={15}
            color="blue"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={Icons.TrendingUp}
            label="Upcoming Drives"
            value={stats.upcomingDrives}
            trend={20}
            color="purple"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={Icons.FileText}
            label="Resume Score"
            value={`${stats.resumeScore}%`}
            trend={5}
            color="emerald"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={Icons.Award}
            label="Tests Completed"
            value={stats.testsCompleted}
            trend={25}
            color="orange"
          />
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Upcoming Drives - Full Width */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <DashboardCard title="Upcoming Placement Drives" icon={Icons.Calendar}>
            <div className="space-y-3">
              {drives.length > 0 ? (
                drives.map((drive, idx) => (
                  <motion.div
                    key={drive.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ translateX: 5 }}
                    className="group p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg border border-slate-200 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                          {(typeof drive.company === 'string' ? drive.company : drive.company?.name)?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{drive.company?.name || drive.company}</h3>
                          <p className="text-sm text-slate-600 mt-1">{drive.position || 'Multiple Positions'}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="success" size="xs">
                              ₹{drive.ctc || 'N/A'} LPA
                            </Badge>
                            <Badge variant="default" size="xs">
                              {drive.eligible_cgpa || 'N/A'} CGPA
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="primary" size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No upcoming drives at the moment</p>
                </div>
              )}
            </div>
          </DashboardCard>
        </motion.div>

        {/* AI Suggestions */}
        <motion.div variants={itemVariants}>
          <DashboardCard title="AI Suggestions" icon={Icons.Lightbulb}>
            <div className="space-y-3">
              {AI_SUGGESTIONS.slice(0, 3).map((suggestion, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-sm text-yellow-300"
                >
                  💡 {suggestion}
                </motion.div>
              ))}
            </div>
          </DashboardCard>
        </motion.div>
      </motion.div>

      {/* Second Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Recent Notifications */}
        <motion.div variants={itemVariants}>
          <DashboardCard title="Recent Notifications" icon={Icons.Bell}>
            <div className="space-y-3">
              {NOTIFICATIONS.slice(0, 4).map((notification, idx) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-3 rounded-lg border transition-all ${
                    notification.read
                      ? 'bg-slate-100 border-slate-200'
                      : 'bg-indigo-500/10 border-indigo-500/20'

                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${notification.read ? 'text-slate-500' : 'text-slate-900'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </DashboardCard>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div variants={itemVariants}>
          <DashboardCard title="Recent Activity" icon={Icons.ActivitySquare}>
            <div className="space-y-4">
              {ACTIVITY_TIMELINE.map((activity, idx) => {
                const IconComponent = Icons[activity.icon === 'briefcase' ? 'Briefcase' : activity.icon === 'award' ? 'Award' : activity.icon === 'user' ? 'User' : activity.icon === 'check' ? 'CheckCircle2' : 'BookOpen']
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0"
                      >
                        <IconComponent className="w-5 h-5 text-indigo-600" />
                      </motion.div>
                      {idx < ACTIVITY_TIMELINE.length - 1 && (
                        <div className="w-0.5 h-12 bg-gradient-to-b from-blue-500/50 to-transparent my-1" />
                      )}
                    </div>
                    <div className="flex-1 py-2">
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-600">{activity.date}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </DashboardCard>
        </motion.div>
      </motion.div>

      {/* Mock Test Performance */}
      <motion.div variants={itemVariants}>
        <DashboardCard title="Mock Test Performance" icon={Icons.Zap}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_TESTS.map((test, idx) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 transition-all"
              >
                <h4 className="font-semibold text-slate-900 text-sm mb-3">{test.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Best Score</span>
                    <span className="text-indigo-600 font-semibold">{test.bestScore}/{test.totalAttempts}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(test.bestScore / test.questions) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                  <Badge variant="default" size="xs">
                    {test.completed ? '✓ Completed' : 'Not Started'}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </motion.div>
    </div>
  )
}
