import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

const Navbar = ({ user }) => {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut(auth)
    navigate('/login')
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const initial = displayName[0].toUpperCase()

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'px-4 py-2 text-sm font-semibold text-green-700 border-b-2 border-green-600'
      : 'px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors'

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-bold text-green-700 text-xl">Eco-Vivah AI</span>
        </div>

        <div className="flex items-center gap-1">
          <NavLink to="/" end className={navLinkClass}>🏠 Dashboard</NavLink>
          <NavLink to="/history" className={navLinkClass}>📋 History</NavLink>
          <NavLink to="/profile" className={navLinkClass}>👤 Profile</NavLink>
        </div>

        <div className="flex items-center gap-3">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full border border-gray-200" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
              {initial}
            </div>
          )}
          <span className="text-sm text-gray-600 hidden md:block">{displayName}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Sign out
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
