import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios.js'

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}
    if (formData.name.length < 20 || formData.name.length > 60)
      newErrors.name = 'Name must be between 20 and 60 characters'
    if (!formData.email.includes('@'))
      newErrors.email = 'Please enter a valid email'
    if (formData.password.length < 8 || formData.password.length > 16)
      newErrors.password = 'Password must be between 8 and 16 characters'
    if (!/[A-Z]/.test(formData.password))
      newErrors.password = 'Password must contain at least one uppercase letter'
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
      newErrors.password = 'Password must contain at least one special character'
    if (formData.address && formData.address.length > 400)
      newErrors.address = 'Address must be under 400 characters'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      await API.post('/auth/register', formData)
      navigate('/login')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center py-8">
      <div className="w-full max-w-md px-4">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-widest text-orange-500">
            StoreRate
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-8 shadow-sm">

          {serverError && (
            <div className="bg-orange-50 border border-orange-300 text-orange-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Your full name (min 20 characters)" className={inputClass} />
              {errors.name && <p className="text-orange-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@example.com" className={inputClass} />
              {errors.email && <p className="text-orange-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                placeholder="8-16 chars, uppercase + special character" className={inputClass} />
              {errors.password && <p className="text-orange-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-gray-400">(optional)</span>
              </label>
              <textarea name="address" value={formData.address} onChange={handleChange}
                placeholder="Your address" rows={3}
                className={`${inputClass} resize-none`} />
              {errors.address && <p className="text-orange-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 font-semibold hover:underline">
              Sign in here
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
