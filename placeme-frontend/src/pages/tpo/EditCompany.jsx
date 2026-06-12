import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { tpoApi } from '../../services/tpoapi'

const EditCompany = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    logo_url: '',
    description: ''
  })

  useEffect(() => {
    fetchCompany()
  }, [])

  const fetchCompany = async () => {

    try {

      const res =
        await tpoApi.getCompany(id)

      setFormData(res.data)

    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await tpoApi.updateCompany(
        id,
        formData
      )

      navigate('/tpo/companies')

    } catch (err) {

      console.log(err)
      alert('Update failed')

    }
  }

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Edit Company
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl border space-y-4"
      >

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
        />

        <input
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
        />

        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
        />

        <input
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
        />

        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
        >
          Update Company
        </button>

      </form>

    </div>
  )
}

export default EditCompany