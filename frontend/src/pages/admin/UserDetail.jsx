import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../api/axios.js'
import Navbar from '../../components/Navbar'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/admin/users/${id}`)
        setUser(res.data.user)
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }
    fetchUser()
  }, [id])

  if (!user) return (
    <div className="flex items-center justify-center h-screen bg-orange-50">
      <p className="text-orange-500 font-medium">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => navigate('/admin')}
          className="text-orange-500 hover:underline text-sm mb-4 inline-flex items-center gap-1 font-medium"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-100">
            User Details
          </h2>
          <div className="space-y-4">
            <DetailRow label="Name" value={user.name} />
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Address" value={user.address || '—'} />
            <DetailRow label="Role" value={user.role.replace('_', ' ')} highlight />
            {user.role === 'store_owner' && (
              <DetailRow
                label="Store Average Rating"
                value={user.average_rating > 0 ? `★ ${user.average_rating}` : 'No ratings yet'}
                highlight
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex border-b border-gray-100 pb-3">
      <span className="w-44 text-sm font-medium text-gray-500">{label}</span>
      <span className={`text-sm capitalize font-medium ${highlight ? 'text-orange-500' : 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  )
}
