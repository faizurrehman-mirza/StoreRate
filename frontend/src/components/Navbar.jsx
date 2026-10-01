import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b-2 border-orange-500 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Left — app name */}
      <h1 className="text-xl font-black uppercase tracking-widest text-orange-500">
        StoreRate
      </h1>

      {/* Right — user info and actions */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Hello, <span className="font-semibold text-gray-800">{user?.name}</span>
        </span>
        <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full capitalize font-medium border border-orange-200">
          {user?.role?.replace('_', ' ')}
        </span>
        <Link
          to="/update-password"
          className="text-sm text-gray-500 hover:text-orange-500 transition font-medium"
        >
          Change Password
        </Link>
        <button
          onClick={handleLogout}
          className="border-2 border-orange-500 text-orange-500 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-orange-500 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
