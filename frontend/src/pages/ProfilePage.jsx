import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { getHistory } from '../api'

const ProfilePage = () => {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory(user?.uid)
        setHistory(response.data.history || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [user])

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const initial = displayName[0].toUpperCase()

  let memberSince = 'Recently joined'
  if (user?.metadata?.creationTime) {
    memberSince = new Date(user.metadata.creationTime).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const totalPlans = history.length
  const validScores = history.map(h => h.sustainability_score).filter(s => s != null)
  const avgScore = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0
  const bestScore = validScores.length ? Math.max(...validScores) : 0

  let totalCarbonSaved = 0
  history.forEach(h => {
    totalCarbonSaved += Math.round((h.carbon_estimate_kg || 0) * 0.18)
  })

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      <Navbar user={user} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-gray-100">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" className="w-20 h-20 rounded-full border-4 border-green-50" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-3xl font-bold border-4 border-green-50">
              {initial}
            </div>
          )}
          
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{displayName}</h1>
            <p className="text-gray-500 mt-1">{user?.email}</p>
            <p className="text-sm text-gray-400 mt-2">Member since: {memberSince}</p>
          </div>

          <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm whitespace-nowrap self-center sm:self-center">
            🌿 Eco Warrior
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
            <span className="block text-3xl font-extrabold text-green-600 mb-1">{totalPlans}</span>
            <span className="text-sm text-gray-500 font-medium">Total Plans</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
            <span className="block text-3xl font-extrabold text-green-600 mb-1">{avgScore}</span>
            <span className="text-sm text-gray-500 font-medium">Avg Score</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
            <span className="block text-3xl font-extrabold text-amber-500 mb-1">{bestScore}</span>
            <span className="text-sm text-gray-500 font-medium">Best Score</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
            <span className="block text-3xl font-extrabold text-blue-500 mb-1">{totalCarbonSaved.toLocaleString()}</span>
            <span className="text-sm text-gray-500 font-medium">kg Carbon Saved</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        
        {loading ? (
          <div className="text-center py-4"><span className="animate-pulse text-gray-400">Loading activity...</span></div>
        ) : history.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">
            No plans generated yet. Create one to see activity here!
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 3).map(plan => (
              <div key={plan.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">Plan #{plan.id} — {plan.venue_location}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(plan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {plan.num_guests} guests
                  </span>
                </div>
                <div className="bg-green-50 text-green-700 font-bold px-3 py-1 rounded-lg border border-green-100">
                  {plan.sustainability_score || "N/A"} / 100
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
