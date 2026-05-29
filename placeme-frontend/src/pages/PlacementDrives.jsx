import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { DashboardCard } from '../components/DashboardCard'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { useState, useEffect } from 'react'
import { placement } from '../services/apiClient'

export const PlacementDrives = () => {
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDrives()
  }, [])

  const fetchDrives = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await placement.getDrives({ is_active: true })
      // Handle paginated response
      const drivesData = Array.isArray(response.data) ? response.data : response.data.results || []
      setDrives(drivesData)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load drives')
      console.error('Error fetching drives:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredDrives = drives.filter((drive) =>
    drive.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drive.position?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Placement Drives</h1>
        <p className="text-slate-600">Browse and apply to active placement drives</p>
      </motion.div>

      {/* Filter & Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 flex-wrap"
      >
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search companies or positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-all"
          />
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        </div>
        <Button variant="secondary" onClick={fetchDrives}>
          Refresh
        </Button>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          <div className="flex items-center gap-2">
            <Icons.AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading drives...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredDrives.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Icons.Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">
            {searchTerm ? 'No drives match your search' : 'No active drives available'}
          </p>
        </motion.div>
      )}

      {/* Drives Grid */}
      {!loading && filteredDrives.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDrives.map((drive) => (
          <motion.div
            key={drive.id}
            variants={itemVariants}
            whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(59, 130, 246, 0.1)' }}
            className="group overflow-hidden rounded-2xl border border-slate-200 backdrop-blur-xl bg-white hover:border-indigo-300 transition-all"
          >
            {/* Header with gradient */}
            <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              {drive.company?.logo_url && (
                <img
                  src={drive.company.logo_url}
                  alt={drive.company?.name}
                  className="absolute w-20 h-20 top-1/2 left-8 -translate-y-1/2 rounded-lg border-2 border-white shadow-lg object-cover"
                />
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900">{drive.company?.name || 'Company'}</h3>
              <p className="text-slate-600 text-sm mt-2">{drive.position}</p>

              {/* Package */}
              <div className="mt-4 p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-xs text-emerald-300 font-medium">PACKAGE (CTC)</p>
                <p className="text-2xl font-bold text-emerald-300 mt-1">
                  {drive.ctc ? `${drive.ctc} LPA` : drive.package || 'N/A'}
                </p>
              </div>

              {/* Requirements */}
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs text-slate-600 mb-2">ELIGIBILITY</p>
                  <Badge variant="default">{drive.eligibility || 'No restriction'}</Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-2">REQUIRED SKILLS</p>
                  <div className="flex flex-wrap gap-2">
                    {drive.required_skills ? (
                      typeof drive.required_skills === 'string'
                        ? drive.required_skills.split(',').map((skill) => (
                            <Badge key={skill.trim()} variant="purple" size="xs">
                              {skill.trim()}
                            </Badge>
                          ))
                        : Array.isArray(drive.required_skills)
                        ? drive.required_skills.map((skill) => (
                            <Badge key={skill} variant="purple" size="xs">
                              {skill}
                            </Badge>
                          ))
                        : <span className="text-xs text-slate-500">No skills specified</span>
                    ) : (
                      <span className="text-xs text-slate-500">No skills specified</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Icons.Calendar className="w-4 h-4" />
                  Deadline: {drive.deadline ? new Date(drive.deadline).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <Button variant="primary" className="flex-1">
                  Apply Now
                </Button>
                <Button variant="secondary" size="md">
                  <Icons.Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
        </motion.div>
      )}

      {/* No More Drives Message */}
      {!loading && filteredDrives.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12"
        >
          <p className="text-slate-600">
            Showing {filteredDrives.length} out of {drives.length} drives
          </p>
        </motion.div>
      )}
    </div>
  )
}
