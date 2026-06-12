import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { tpoApi } from '../../services/tpoapi'

const TPODrives = () => {
  const navigate = useNavigate()

  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDrives()
  }, [])

  const fetchDrives = async () => {
    try {
      const res = await tpoApi.getDrives()
      setDrives(res.data.results || res.data || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteDrive = async (id) => {
    if (!window.confirm('Delete this drive?')) return

    try {
      await tpoApi.deleteDrive(id)

      setDrives(
        drives.filter((drive) => drive.id !== id)
      )
    } catch (err) {
      console.log(err)
      alert('Failed to delete drive')
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Placement Drives
          </h1>

          <p className="text-slate-500">
            Manage hiring drives
          </p>
        </div>

        <button
          onClick={() =>
            navigate('/tpo/drives/create')
          }
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <Icons.Plus size={18} />
          Create Drive
        </button>

      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Position</th>
              <th className="p-4 text-left">Package</th>
              <th className="p-4 text-left">Applications</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center"
                >
                  Loading...
                </td>
              </tr>

            ) : (

              drives.map((drive) => (

                <tr
                  key={drive.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {drive.company?.name}
                  </td>

                  <td className="p-4">
                    {drive.position}
                  </td>

                  <td className="p-4">
                    {drive.package}
                  </td>

                  <td className="p-4">
                    {drive.total_applications}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        drive.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {drive.is_active
                        ? 'Active'
                        : 'Closed'}
                    </span>

                  </td>

                  <td className="p-4 flex gap-3">

                   <button onClick={() => navigate(`/tpo/drives/edit/${drive.id}`)}>
                    <Icons.Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        deleteDrive(drive.id)
                      }
                    >
                      <Icons.Trash2
                        size={18}
                        className="text-red-500"
                      />
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default TPODrives