import { useState, useEffect } from 'react'
import API from '../../api/axios.js'
import Navbar from '../../components/Navbar'

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/ratings/my-store')
        setData(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load store data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-orange-50">
      <p className="text-orange-500 font-medium">Loading...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-orange-50 border border-orange-300 text-orange-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Store Dashboard</h2>

        {/* Store stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1 font-medium">Store Name</p>
            <p className="text-xl font-bold text-gray-800">{data.store}</p>
          </div>
          <div className="bg-white rounded-2xl border-2 border-orange-300 shadow-sm p-6">
            <p className="text-sm text-orange-500 mb-1 font-medium">Average Rating</p>
            <p className="text-4xl font-black text-orange-500">
              ★ {data.average_rating > 0
                ? parseFloat(data.average_rating).toFixed(1)
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Based on {data.total_ratings} rating{data.total_ratings !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Ratings table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Users Who Rated Your Store
          </h3>

          {data.ratings.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No ratings yet. Share your store to get ratings!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    <th className="px-4 py-3 text-xs uppercase font-semibold text-orange-600">User Name</th>
                    <th className="px-4 py-3 text-xs uppercase font-semibold text-orange-600">Email</th>
                    <th className="px-4 py-3 text-xs uppercase font-semibold text-orange-600">Rating</th>
                    <th className="px-4 py-3 text-xs uppercase font-semibold text-orange-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.ratings.map(r => (
                    <tr key={r.user_id} className="hover:bg-orange-50 transition">
                      <td className="px-4 py-3 text-gray-800 font-medium">{r.user_name}</td>
                      <td className="px-4 py-3 text-gray-500">{r.user_email}</td>
                      <td className="px-4 py-3">
                        <span className="text-orange-400">{'★'.repeat(r.rating)}</span>
                        <span className="text-gray-200">{'★'.repeat(5 - r.rating)}</span>
                        <span className="ml-1 text-gray-600">({r.rating})</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
