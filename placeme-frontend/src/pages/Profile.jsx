import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import * as Icons from 'lucide-react'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { auth } from '../services/apiClient'

export const Profile = () => {
  const [user, setUser] = useState(null)

  const [loading, setLoading] =
    useState(true)

  const [showEditModal, setShowEditModal] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  const [formData, setFormData] =
    useState({
      first_name: '',
      last_name: '',
      email: '',
      phone: ''
    })

  // ============================================
  // FETCH PROFILE
  // ============================================

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)

      const response =
        await auth.getProfile()

      const userData = response.data

      setUser(userData)

      setFormData({
        first_name:
          userData.first_name || '',
        last_name:
          userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      })

    } catch (error) {
      console.error(
        'Failed to fetch profile:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // UPDATE PROFILE
  // ============================================

  const handleUpdateProfile = async (
    e
  ) => {
    e.preventDefault()

    try {
      setSaving(true)

      const response =
        await auth.updateProfile(
          formData
        )

      setUser(response.data)

      setShowEditModal(false)

    } catch (error) {
      console.error(
        'Failed to update profile:',
        error
      )
    } finally {
      setSaving(false)
    }
  }

  // ============================================
  // AVATAR
  // ============================================

  const userAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${
    user?.username || 'user'
  }`

  const fullName =
    user?.first_name ||
    user?.last_name
      ? `${user?.first_name || ''} ${
          user?.last_name || ''
        }`
      : user?.username

  // ============================================
  // ROLE COLORS
  // ============================================

  const getRoleVariant = (role) => {
    switch (role) {
      case 'student':
        return 'primary'

      case 'recruiter':
        return 'success'

      case 'tpo':
        return 'warning'

      default:
        return 'secondary'
    }
  }

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">

          <div className="w-14 h-14 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-slate-600 text-lg">
            Loading profile...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          My Profile
        </h1>

        <p className="text-slate-600">
          Manage your personal
          information
        </p>
      </motion.div>

      {/* PROFILE CARD */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >

        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />

        <div className="relative z-10">

          <div className="flex flex-col lg:flex-row lg:items-center gap-8">

            {/* AVATAR */}
            <motion.div
              whileHover={{
                scale: 1.05
              }}
              className="relative"
            >

              <img
                src={userAvatar}
                alt={fullName}
                className="w-32 h-32 rounded-full border-4 border-indigo-500/30 shadow-lg"
              />

              <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-500 border-4 border-white" />
            </motion.div>

            {/* INFO */}
            <div className="flex-1">

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                <div>

                  <h2 className="text-4xl font-bold text-slate-900">
                    {fullName}
                  </h2>

                  <p className="text-slate-600 text-lg mt-2">
                    @{user?.username}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5">

                    <Badge
                      variant={getRoleVariant(
                        user?.role
                      )}
                    >
                      {user?.role}
                    </Badge>

                    <Badge variant="secondary">
                      Active User
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() =>
                    setShowEditModal(
                      true
                    )
                  }
                >
                  <Icons.Edit className="w-4 h-4" />

                  Edit Profile
                </Button>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">

                  <div className="flex items-center gap-3 mb-2">

                    <Icons.Mail className="w-5 h-5 text-indigo-600" />

                    <p className="text-sm text-slate-500">
                      Email
                    </p>
                  </div>

                  <p className="text-slate-900 font-semibold">
                    {user?.email ||
                      'Not Provided'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">

                  <div className="flex items-center gap-3 mb-2">

                    <Icons.Phone className="w-5 h-5 text-indigo-600" />

                    <p className="text-sm text-slate-500">
                      Phone
                    </p>
                  </div>

                  <p className="text-slate-900 font-semibold">
                    {user?.phone ||
                      'Not Provided'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">

                  <div className="flex items-center gap-3 mb-2">

                    <Icons.User className="w-5 h-5 text-indigo-600" />

                    <p className="text-sm text-slate-500">
                      First Name
                    </p>
                  </div>

                  <p className="text-slate-900 font-semibold">
                    {user?.first_name ||
                      'Not Provided'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">

                  <div className="flex items-center gap-3 mb-2">

                    <Icons.Users className="w-5 h-5 text-indigo-600" />

                    <p className="text-sm text-slate-500">
                      Last Name
                    </p>
                  </div>

                  <p className="text-slate-900 font-semibold">
                    {user?.last_name ||
                      'Not Provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* QUICK STATS */}
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >

        <div className="p-6 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">

          <div className="flex items-center justify-between mb-4">

            <Icons.Briefcase className="w-8 h-8 text-indigo-600" />

            <Badge variant="primary">
              Profile
            </Badge>
          </div>

          <h3 className="text-2xl font-bold text-slate-900">
            Student
          </h3>

          <p className="text-slate-600 text-sm mt-1">
            Placement Portal User
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">

          <div className="flex items-center justify-between mb-4">

            <Icons.CheckCircle2 className="w-8 h-8 text-emerald-600" />

            <Badge variant="success">
              Verified
            </Badge>
          </div>

          <h3 className="text-2xl font-bold text-slate-900">
            Active
          </h3>

          <p className="text-slate-600 text-sm mt-1">
            Account Status
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white">

          <div className="flex items-center justify-between mb-4">

            <Icons.Calendar className="w-8 h-8 text-purple-600" />

            <Badge variant="secondary">
              Joined
            </Badge>
          </div>

          <h3 className="text-2xl font-bold text-slate-900">
            2026
          </h3>

          <p className="text-slate-600 text-sm mt-1">
            Platform Member
          </p>
        </div>
      </motion.div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-xl rounded-3xl bg-white p-8">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-3xl font-bold text-slate-900">
                Edit Profile
              </h2>

              <button
                onClick={() =>
                  setShowEditModal(
                    false
                  )
                }
              >
                <Icons.X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <form
              onSubmit={
                handleUpdateProfile
              }
              className="space-y-5"
            >

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>

                <input
                  type="text"
                  value={
                    formData.first_name
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      first_name:
                        e.target
                          .value
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>

                <input
                  type="text"
                  value={
                    formData.last_name
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      last_name:
                        e.target
                          .value
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={
                    formData.email
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email:
                        e.target
                          .value
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>

                <input
                  type="text"
                  value={
                    formData.phone
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone:
                        e.target
                          .value
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}