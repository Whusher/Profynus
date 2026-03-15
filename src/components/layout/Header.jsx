import { useEffect, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router"
import { Bell, Clock3, LogOut, Menu, Sparkles, UserRound, X } from "lucide-react"
import { useAuthStore } from "@store/index"
import Logo from "./Logo"

const navigationItems = [
  { label: "Home", href: "/home" },
  { label: "Feed", href: "/feed" },
  { label: "Friends", href: "/friends" },
  { label: "Account", href: "/profile" },
  { label: "History", href: "/history" },
  { label: "Music Player", href: "/moremusic" },
]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const displayName = user?.name || user?.username || "Profynus User"
  const emailLabel = user?.email || "Secure session active"
  const avatarLabel = displayName.charAt(0).toUpperCase()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-400/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/home"
              className="flex items-center gap-3 rounded-full border border-cyan-400/20 bg-white/5 px-2 py-2 pr-4 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
            >
              <Logo size={42} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Profynus</p>
                <p className="truncate text-xs text-slate-400">Music platform workspace</p>
              </div>
            </Link>

            <div className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/3 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-400 xl:flex">
              <Sparkles size={14} className="text-cyan-300" />
              Weekly competition live
            </div>
          </div>

          <nav className="hidden flex-1 justify-center lg:flex">
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/8 bg-white/3 p-2 shadow-[0_12px_40px_rgba(2,12,27,0.35)]">
              {navigationItems.map((item) => (
                <DesktopNavLink key={item.href} {...item} />
              ))}
            </div>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-3 py-2 text-sm text-slate-300">
              <Clock3 size={16} className="text-cyan-300" />
              <span className="font-mono text-cyan-200">{formattedTime}</span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-white/3 text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-cyan-200"
              aria-label="Open account"
            >
              <Bell size={18} />
            </button>

            <div className="flex items-center gap-3 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-sm font-semibold text-slate-950">
                {avatarLabel}
              </div>
              <div className="max-w-48 min-w-0">
                <p className="truncate text-sm font-medium text-white">{displayName}</p>
                <p className="truncate text-xs text-slate-400">{emailLabel}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-100 transition hover:border-red-300/40 hover:bg-red-500/20"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-white/3 text-cyan-300 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 lg:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-cyan-400/10 py-4 lg:hidden">
            <div className="space-y-4 rounded-[28px] border border-white/8 bg-white/3 p-4 shadow-[0_20px_60px_rgba(2,12,27,0.45)]">
              <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400 text-sm font-semibold text-slate-950">
                  {avatarLabel}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{displayName}</p>
                  <p className="truncate text-xs text-slate-400">{emailLabel}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-300">
                  <Clock3 size={14} className="text-cyan-300" />
                  {formattedTime}
                </div>
              </div>

              <nav className="grid gap-2">
                {navigationItems.map((item) => (
                  <MobileNavLink key={item.href} {...item} />
                ))}
              </nav>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
                >
                  <UserRound size={16} />
                  Account
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100 transition hover:border-red-300/40 hover:bg-red-500/20"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}

function DesktopNavLink({ href, label }) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        [
          "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
          isActive
            ? "bg-cyan-400 text-slate-950 shadow-[0_12px_30px_rgba(34,211,238,0.28)]"
            : "text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-200",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  )
}

function MobileNavLink({ href, label }) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        [
          "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-300",
          isActive
            ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-200"
            : "border-white/8 bg-white/3 text-white hover:border-cyan-300/30 hover:bg-cyan-400/5",
        ].join(" ")
      }
    >
      <span>{label}</span>
      <span className="text-xs uppercase tracking-[0.22em] text-slate-400">Open</span>
    </NavLink>
  )
}