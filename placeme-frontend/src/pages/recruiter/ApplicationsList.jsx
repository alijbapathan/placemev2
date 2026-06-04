import { useEffect, useState } from 'react'
import { recruiterService } from '../../services/api'
import { toast } from 'react-toastify'
import * as Icons from 'lucide-react'

export default function ApplicationsList() {

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {

      const response =
        await recruiterService.getApplications()

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || []

      // setApplications(data)
         if (data.length === 0) {

  setApplications([
    {
      id: 101,
      student_name: 'Aditya Sharma',
      status: 'applied',
      applied_at: new Date().toISOString(),
      drive: {
        position: 'Frontend Developer',
        company: {
          name: 'Google'
        }
      }
    },
    {
      id: 102,
      student_name: 'Priya Patel',
      status: 'shortlisted',
      applied_at: new Date().toISOString(),
      drive: {
        position: 'Backend Developer',
        company: {
          name: 'Microsoft'
        }
      }
    },
    {
      id: 103,
      student_name: 'Rahul Verma',
      status: 'interviewed',
      applied_at: new Date().toISOString(),
      drive: {
        position: 'Software Engineer',
        company: {
          name: 'Amazon'
        }
      }
    },
    {
      id: 104,
      student_name: 'Sneha Kulkarni',
      status: 'selected',
      applied_at: new Date().toISOString(),
      drive: {
        position: 'Data Analyst',
        company: {
          name: 'Meta'
        }
      }
    },
    {
      id: 105,
      student_name: 'Aman Singh',
      status: 'rejected',
      applied_at: new Date().toISOString(),
      drive: {
        position: 'Full Stack Developer',
        company: {
          name: 'Netflix'
        }
      }
    }
  ])

} else {

  setApplications(data)

}





    } catch (error) {
      console.error(error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (
    id,
    status
  ) => {

    try {

      await recruiterService.updateApplicationStatus(
        id,
        status
      )

      toast.success(
        `Application ${status}`
      )

      fetchApplications()

    } catch (error) {

      console.error(error)

      toast.error(
        'Failed to update application'
      )
    }
  }

  const filteredApplications =
    applications.filter((app) =>
      app.student_name
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    )

  const getStatusColor = (status) => {

    switch (status) {

      case 'selected':
        return 'bg-green-100 text-green-700'

      case 'shortlisted':
        return 'bg-blue-100 text-blue-700'

      case 'interviewed':
        return 'bg-purple-100 text-purple-700'

      case 'rejected':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          Applications
        </h1>

        <p className="text-slate-500 mt-2">
          Review and manage applicants
        </p>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl border p-5">
          <p className="text-slate-500">
            Total
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {applications.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <p className="text-slate-500">
            Applied
          </p>

          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            {
              applications.filter(
                a => a.status === 'applied'
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <p className="text-slate-500">
            Shortlisted
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {
              applications.filter(
                a => a.status === 'shortlisted'
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <p className="text-slate-500">
            Selected
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {
              applications.filter(
                a => a.status === 'selected'
              ).length
            }
          </h2>
        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl border p-4">

        <div className="relative">

          <Icons.Search
            className="absolute left-3 top-3.5 w-4 h-4 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search applicant..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3 pl-10"
          />

        </div>

      </div>

      {/* Loading */}

      {loading && (
        <div className="text-center py-20">
          Loading applications...
        </div>
      )}

      {/* Applications */}

      {!loading && (

        <div className="grid gap-6">

          {filteredApplications.map((app) => (

            <div
              key={app.id}
              className="bg-white rounded-2xl border p-6"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="text-xl font-bold">
                    {app.student_name}
                  </h3>

                  <p className="text-slate-500">
                    {app.drive?.position}
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    {app.drive?.company?.name}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(app.status)}`}
                >
                  {app.status}
                </span>

              </div>

              <div className="mt-4 text-sm text-slate-500">

                Applied on

                {' '}

                {new Date(
                  app.applied_at
                ).toLocaleDateString()}

              </div>

              <div className="flex flex-wrap gap-3 mt-6">

                <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      'shortlisted'
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700"
                >
                  Shortlist
                </button>

                {/* <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      'interviewed'
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700"
                >
                  Interview
                </button> */}

                <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      'selected'
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-green-100 text-green-700"
                >
                  Select
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      app.id,
                      'rejected'
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-red-100 text-red-700"
                >
                  Reject
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}