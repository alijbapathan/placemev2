import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { tpoApi } from '../../services/tpoapi'

const EditDrive = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [companies, setCompanies] = useState([])

  const [formData, setFormData] = useState({
    company_id: '',
    position: '',
    package: '',
    eligibility: 'All',
    required_skills: '',
    job_description: '',
    deadline: '',
    location: '',
    is_active: true
  })

  useEffect(() => {
    loadCompanies()
    loadDrive()
  }, [])

  const loadCompanies = async () => {
    try {
      const res = await tpoApi.getCompanies()

      setCompanies(
        res.data.results || res.data || []
      )
    } catch (err) {
      console.log(err)
    }
  }

  const loadDrive = async () => {
    try {
      const res = await tpoApi.getDrive(id)

      setFormData({
        company_id: res.data.company.id,
        position: res.data.position,
        package: res.data.package,
        eligibility: res.data.eligibility,
        required_skills: res.data.required_skills,
        job_description: res.data.job_description,
        deadline: res.data.deadline
          ?.slice(0, 16),
        location: res.data.location,
        is_active: res.data.is_active
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await tpoApi.updateDrive(id, formData)

      navigate('/tpo/drives')
    } catch (err) {
      console.log(err)
      alert('Failed to update drive')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Edit Drive
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl border space-y-4"
      >

        <select
          name="company_id"
          value={formData.company_id}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
        >
          {companies.map(company => (
            <option
              key={company.id}
              value={company.id}
            >
              {company.name}
            </option>
          ))}
        </select>

        <input
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
        />

        <input
          name="package"
          value={formData.package}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
        />

        <textarea
          name="required_skills"
          value={formData.required_skills}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
        />

        <textarea
          name="job_description"
          value={formData.job_description}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
        />

        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
        />

        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
        >
          Update Drive
        </button>

      </form>

    </div>
  )
}

export default EditDrive