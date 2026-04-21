import Navbar from '../components/Navbar'
import HistoryPage from '../components/HistoryPage'
import { useAuth } from '../context/AuthContext'

const HistoryPageWrapper = () => {
  const { user } = useAuth()
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <HistoryPage />
      </div>
    </div>
  )
}

export default HistoryPageWrapper
