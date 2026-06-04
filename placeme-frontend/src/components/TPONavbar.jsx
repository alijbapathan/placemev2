import * as Icons from 'lucide-react'
import { useAuthStore } from '../context/authContext'
import { useNavigate } from 'react-router-dom'

export default function TPONavbar() {
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="fixed top-0 left-72 right-0 h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

      <div>
        <h2 className="text-xl font-semibold">Training & Placement Officer</h2>
      </div>

      <div className="flex items-center gap-5">

        <Icons.Bell />

        <div className="flex items-center gap-2">

          <div className="w-10 h-10 rounded-full bg-indigo-500" />

          <div>
            <p className="font-medium">{user?.full_name || user?.username || 'TPO Admin'}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>

        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/tpo/profile')}
            className="text-sm text-slate-700 hover:underline"
            aria-label="Profile"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="ml-4 text-sm text-red-600 hover:underline"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  )
}