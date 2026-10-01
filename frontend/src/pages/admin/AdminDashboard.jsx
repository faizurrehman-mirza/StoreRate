import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios.js'
import Navbar from '../../components/Navbar'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 })
  const [users, setUsers] = useState([])
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' })
  const [userSort, setUserSort] = useState({ sortBy: 'created_at', order: 'desc' })
  const [stores, setStores] = useState([])
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' })
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', order: 'asc' })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddStore, setShowAddStore] = useState(false)

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/dashboard')
      setStats(res.data)
    } catch (err) { console.error(err) }
  }

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users', { params: { ...userFilters, ...userSort } })
      setUsers(res.data.users)
    } catch (err) { console.error(err) }
  }

  const fetchStores = async () => {
    try {
      const res = await API.get('/admin/stores', { params: { ...storeFilters, ...storeSort } })
      setStores(res.data.stores)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats()
    if (activeTab === 'users') fetchUsers()
    if (activeTab === 'stores') fetchStores()
  }, [activeTab])

  useEffect(() => { if (activeTab === 'users') fetchUsers() }, [userFilters, userSort])
  useEffect(() => { if (activeTab === 'stores') fetchStores() }, [storeFilters, storeSort])

  const handleUserSort = (field) => {
    setUserSort(prev => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleStoreSort = (field) => {
    setStoreSort(prev => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc'
    }))
  }

  const SortIcon = ({ field, currentSort }) => (
    <span className="ml-1 inline-flex flex-col" style={{ fontSize: 8, lineHeight: 1.2 }}>
      <span className={currentSort.sortBy === field && currentSort.order === 'asc' ? 'text-orange-500' : 'text-gray-400'}>▲</span>
      <span className={currentSort.sortBy === field && currentSort.order === 'desc' ? 'text-orange-500' : 'text-gray-400'}>▼</span>
    </span>
  )

  const inputClass = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white w-full"

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {['dashboard', 'users', 'stores'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium text-sm capitalize transition border ${
                activeTab === tab
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Users" value={stats.totalUsers} />
            <StatCard label="Total Stores" value={stats.totalStores} />
            <StatCard label="Total Ratings" value={stats.totalRatings} />
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Users</h2>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                + Add User
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {['name', 'email', 'address'].map(field => (
                <input
                  key={field} type="text"
                  placeholder={`Filter by ${field}`}
                  value={userFilters[field]}
                  onChange={e => setUserFilters({ ...userFilters, [field]: e.target.value })}
                  className={inputClass}
                />
              ))}
              <select
                value={userFilters.role}
                onChange={e => setUserFilters({ ...userFilters, role: e.target.value })}
                className={inputClass}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    {[
                      { label: 'Name', field: 'name' },
                      { label: 'Email', field: 'email' },
                      { label: 'Address', field: 'address' },
                      { label: 'Role', field: 'role' },
                    ].map(col => (
                      <th
                        key={col.field}
                        onClick={() => handleUserSort(col.field)}
                        className="px-4 py-3 cursor-pointer text-xs uppercase font-semibold text-orange-600"
                      >
                        {col.label}
                        <SortIcon field={col.field} currentSort={userSort} />
                      </th>
                    ))}
                    <th className="px-4 py-3 text-xs uppercase font-semibold text-orange-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">No users found</td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className="hover:bg-orange-50 transition">
                        <td className="px-4 py-3 text-gray-800">{user.name}</td>
                        <td className="px-4 py-3 text-gray-600">{user.email}</td>
                        <td className="px-4 py-3 text-gray-600">{user.address || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-orange-100 text-orange-700'
                              : user.role === 'store_owner'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                            className="text-orange-500 hover:underline text-xs font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── STORES TAB ── */}
        {activeTab === 'stores' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Stores</h2>
              <button
                onClick={() => setShowAddStore(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                + Add Store
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
              {['name', 'email', 'address'].map(field => (
                <input
                  key={field} type="text"
                  placeholder={`Filter by ${field}`}
                  value={storeFilters[field]}
                  onChange={e => setStoreFilters({ ...storeFilters, [field]: e.target.value })}
                  className={inputClass}
                />
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    {[
                      { label: 'Name', field: 'name' },
                      { label: 'Email', field: 'email' },
                      { label: 'Address', field: 'address' },
                      { label: 'Rating', field: 'average_rating' },
                    ].map(col => (
                      <th
                        key={col.field}
                        onClick={() => handleStoreSort(col.field)}
                        className="px-4 py-3 cursor-pointer text-xs uppercase font-semibold text-orange-600"
                      >
                        {col.label}
                        <SortIcon field={col.field} currentSort={storeSort} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stores.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-400">No stores found</td>
                    </tr>
                  ) : (
                    stores.map(store => (
                      <tr key={store.id} className="hover:bg-orange-50 transition">
                        <td className="px-4 py-3 text-gray-800">{store.name}</td>
                        <td className="px-4 py-3 text-gray-600">{store.email}</td>
                        <td className="px-4 py-3 text-gray-600">{store.address || '—'}</td>
                        <td className="px-4 py-3">
                          <StarRating rating={store.average_rating} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onSuccess={() => { setShowAddUser(false); fetchUsers() }}
        />
      )}
      {showAddStore && (
        <AddStoreModal
          onClose={() => setShowAddStore(false)}
          onSuccess={() => { setShowAddStore(false); fetchStores() }}
        />
      )}
    </div>
  )
}

// ── SMALL COMPONENTS ──────────────────────────────────────

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-4xl font-black text-orange-500 mt-2">{value}</p>
    </div>
  )
}

function StarRating({ rating }) {
  const r = parseFloat(rating) || 0
  return (
    <span className="flex items-center gap-1">
      <span className="text-orange-400">★</span>
      <span className="text-gray-700">{r > 0 ? r.toFixed(1) : 'No ratings'}</span>
    </span>
  )
}

function AddUserModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', address: '', role: 'user'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      setError('Name must be between 20 and 60 characters')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email')
      return false
    }
    if (formData.password.length < 8 || formData.password.length > 16) {
      setError('Password must be between 8 and 16 characters')
      return false
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter')
      return false
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError('Password must contain at least one special character')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      await API.post('/admin/users', formData)
      onSuccess()
    } catch (err) {
      const data = err.response?.data
      if (data?.errors && data.errors.length > 0) {
        setError(data.errors[0].msg)
      } else {
        setError(data?.message || 'Failed to create user')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"

  return (
    <Modal title="Add New User" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="bg-orange-50 border border-orange-200 text-orange-600 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
        <input placeholder="Full Name (min 20 chars)" value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className={inputClass} />
        <input placeholder="Email" type="email" value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className={inputClass} />
        <input placeholder="Password" type="password" value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          className={inputClass} />
        <input placeholder="Address (optional)" value={formData.address}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
          className={inputClass} />
        <select value={formData.role}
          onChange={e => setFormData({ ...formData, role: e.target.value })}
          className={inputClass}>
          <option value="user">Normal User</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button type="submit" disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50">
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </Modal>
  )
}

function AddStoreModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', owner_id: ''
  })
  const [owners, setOwners] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await API.get('/admin/users', { params: { role: 'store_owner' } })
        setOwners(res.data.users)
      } catch (err) { console.error(err) }
    }
    fetchOwners()
  }, [])

  const validate = () => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      setError('Store name must be between 20 and 60 characters')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      await API.post('/admin/stores', {
        ...formData,
        owner_id: formData.owner_id ? parseInt(formData.owner_id) : undefined
      })
      onSuccess()
    } catch (err) {
      const data = err.response?.data
      if (data?.errors && data.errors.length > 0) {
        setError(data.errors[0].msg)
      } else {
        setError(data?.message || 'Failed to create store')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"

  return (
    <Modal title="Add New Store" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="bg-orange-50 border border-orange-200 text-orange-600 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
        <input placeholder="Store Name (min 20 chars)" value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className={inputClass} />
        <input placeholder="Store Email" type="email" value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className={inputClass} />
        <input placeholder="Address (optional)" value={formData.address}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
          className={inputClass} />
        <select value={formData.owner_id}
          onChange={e => setFormData({ ...formData, owner_id: e.target.value })}
          className={inputClass}>
          <option value="">Select Store Owner (optional)</option>
          {owners.length === 0 ? (
            <option disabled>No store owners found — add one first</option>
          ) : (
            owners.map(owner => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))
          )}
        </select>
        <button type="submit" disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Store'}
        </button>
      </form>
    </Modal>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-orange-200 p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose}
            className="text-gray-400 hover:text-orange-500 text-xl transition">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
