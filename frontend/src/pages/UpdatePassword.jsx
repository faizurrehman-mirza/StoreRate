import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios.js'
import Navbar from '../components/Navbar'

export default function UpdatePassword() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin'
    if (user?.role === 'store_owner') return '/store-owner'
    return '/dashboard'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)
    try {
      await API.put('/auth/update-password', formData)
      setMessage('Password updated successfully')
      setFormData({ currentPassword: '', newPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-md mx-auto p-6">

        <button
          onClick={() => navigate(getDashboardPath())}
          className="text-orange-500 hover:underline text-sm mb-4 inline-flex items-center gap-1 font-medium"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-100">
            Update Password
          </h2>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="8-16 chars, uppercase + special character"
                className={inputClass}
                required
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
