import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  return (
    <header className="safe-top sticky top-0 z-30 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        {isHome ? (
          <Link to="/" className="flex items-center gap-2 text-leaf-800">
            <span className="text-2xl">🌿</span>
            <span className="text-lg font-bold">식물 관리</span>
          </Link>
        ) : (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-leaf-700 font-semibold"
            aria-label="뒤로"
          >
            <span className="text-xl">‹</span> 뒤로
          </button>
        )}
        <Link
          to="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-full text-leaf-700 hover:bg-leaf-50"
          aria-label="설정 및 백업"
        >
          <span className="text-xl">⚙️</span>
        </Link>
      </div>
    </header>
  )
}
