import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
import { DashboardCard } from '../components/DashboardCard'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { auth } from '../services/apiClient'

const ComingSoonSection = ({ title, icon: Icon }) => {
  return (
    <DashboardCard title={title} icon={Icon}>
      <div className="py-12 flex flex-col items-center justify-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-5xl mb-4"
        >
          🚀
        </motion.div>
        <p className="text-slate-600 text-center">
          This feature is coming soon. We're building something amazing!
        </p>
      </div>
    </DashboardCard>
  )
}

export const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await auth.getProfile()
        setUser(res.data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const userName = user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'Student'
  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-600">Manage your personal information and portfolio</p>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 backdrop-blur-xl bg-white p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative z-10">
          <div className="flex items-start gap-6">
            <img
              src={userAvatar}
              alt={userName}
              className="w-24 h-24 rounded-full border-4 border-indigo-500/50 object-cover"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900">{userName}</h2>
              <p className="text-slate-600 mt-1">{user?.email || 'No email provided'}</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Badge variant="default">{user?.branch || 'Computer Science'}</Badge>
                <Badge variant="success">CGPA: {user?.cgpa || 'N/A'}</Badge>
                <Badge variant="purple">Joined: {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</Badge>
              </div>
            </div>
            <Button variant="primary">Edit Profile</Button>
          </div>
        </div>
      </motion.div>

      {/* Profile Sections */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ComingSoonSection title="Skills" icon={Icons.Zap} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ComingSoonSection title="Projects" icon={Icons.Code} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ComingSoonSection title="Certifications" icon={Icons.Award} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ComingSoonSection title="Resume" icon={Icons.FileDown} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <ComingSoonSection title="Social Links" icon={Icons.Share2} />
        </motion.div>
      </motion.div>
    </div>
  )
}
