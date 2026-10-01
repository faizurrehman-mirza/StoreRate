import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios.js'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // Error and loading state
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Updates form state when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // stops page from refreshing on form submit
    setError('')
    setLoading(true)

    try {
      const response = await API.post('/auth/login', formData)
      const { token, user } = response.data

      // Save to context and localStorage
      login(user, token)

      // Redirect based on role
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'user') navigate('/dashboard')
      else if (user.role === 'store_owner') navigate('/store-owner')

    } catch (err) {
      // Show error message from backend or generic message
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          StoreRate
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Sign in to your account
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>

      </div>
    </div>
  )
}
