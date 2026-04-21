import HistoryPage from '../components/HistoryPage'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const HistoryPageRoute = () => {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <HistoryPage />
      </div>
    </div>
  )
}

export default HistoryPageRoute
