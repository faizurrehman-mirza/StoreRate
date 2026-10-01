import { useState, useEffect } from 'react'
import API from '../../api/axios.js'
import Navbar from '../../components/Navbar'

export default function UserDashboard() {
  const [stores, setStores] = useState([])
  const [filters, setFilters] = useState({ name: '', address: '' })
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' })
  const [ratingInput, setRatingInput] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const fetchStores = async () => {
    try {
      const res = await API.get('/stores', { params: { ...filters, ...sort } })
      setStores(res.data.stores)
      const inputs = {}
      res.data.stores.forEach(store => {
        inputs[store.id] = store.my_rating || ''
      })
      setRatingInput(inputs)
    } catch (err) {
      console.error('Failed to fetch stores:', err)
    }
  }

  useEffect(() => { fetchStores() }, [filters, sort])

  const handleSort = (field) => {
    setSort(prev => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc'
    }))
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const showError = (msg) => {
    setError(msg)
    setTimeout(() => setError(''), 3000)
  }

  const handleSubmitRating = async (storeId) => {
    const rating = parseInt(ratingInput[storeId])
    if (!rating || rating < 1 || rating > 5) { showError('Rating must be between 1 and 5'); return }
    try {
      await API.post('/ratings', { store_id: storeId, rating })
      showMessage('Rating submitted successfully')
      fetchStores()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit rating')
    }
  }

  const handleUpdateRating = async (storeId) => {
    const rating = parseInt(ratingInput[storeId])
    if (!rating || rating < 1 || rating > 5) { showError('Rating must be between 1 and 5'); return }
    try {
      await API.put(`/ratings/${storeId}`, { rating })
      showMessage('Rating updated successfully')
      fetchStores()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update rating')
    }
  }

  const SortIcon = ({ field }) => (
    <span className="ml-1 inline-flex flex-col" style={{ fontSize: 8, lineHeight: 1.2 }}>
      <span className={sort.sortBy === field && sort.order === 'asc' ? 'text-orange-500' : 'text-gray-400'}>▲</span>
      <span className={sort.sortBy === field && sort.order === 'desc' ? 'text-orange-500' : 'text-gray-400'}>▼</span>
    </span>
  )

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Listings</h2>

        {/* Messages */}
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

        {/* Search filters */}
        <div className="flex gap-3 mb-6">
          <input
            type="text" placeholder="Search by store name"
            value={filters.name}
            onChange={e => setFilters({ ...filters, name: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
          />
          <input
            type="text" placeholder="Search by address"
            value={filters.address}
            onChange={e => setFilters({ ...filters, address: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-orange-50 border-b border-orange-100">
                <tr>
                  <th onClick={() => handleSort('name')}
                    className="px-4 py-3 cursor-pointer text-xs uppercase font-semibold text-orange-600">
                    Store Name <SortIcon field="name" />
                  </th>
                  <th onClick={() => handleSort('address')}
                    className="px-4 py-3 cursor-pointer text-xs uppercase font-semibold text-orange-600">
                    Address <SortIcon field="address" />
                  </th>
                  <th onClick={() => handleSort('average_rating')}
                    className="px-4 py-3 cursor-pointer text-xs uppercase font-semibold text-orange-600">
                    Overall Rating <SortIcon field="average_rating" />
                  </th>
                  <th className="px-4 py-3 text-xs uppercase font-semibold text-orange-600">Your Rating</th>
                  <th className="px-4 py-3 text-xs uppercase font-semibold text-orange-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">No stores found</td>
                  </tr>
                ) : (
                  stores.map(store => (
                    <tr key={store.id} className="hover:bg-orange-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{store.name}</td>
                      <td className="px-4 py-3 text-gray-500">{store.address || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1">
                          <span className="text-orange-400">★</span>
                          <span className="text-gray-700">
                            {store.average_rating
                              ? parseFloat(store.average_rating).toFixed(1)
                              : 'No ratings'}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={ratingInput[store.id] || ''}
                          onChange={e => setRatingInput({ ...ratingInput, [store.id]: e.target.value })}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-orange-500"
                        >
                          <option value="">Select</option>
                          {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        {store.my_rating ? (
                          <button
                            onClick={() => handleUpdateRating(store.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1.5 rounded-lg transition font-medium"
                          >
                            Update
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSubmitRating(store.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg transition font-medium"
                          >
                            Submit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
