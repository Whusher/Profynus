import { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router"
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
    <header className="sticky top-0 z-40 border-b border-[color:var(--prof-border)] bg-[var(--prof-bg-base)]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/home"
              className="group flex items-center gap-3 rounded-full border border-[color:var(--prof-border)] bg-linear-to-r from-[var(--prof-bg-chip)] via-[var(--prof-bg-base)] to-[var(--prof-bg-base)] px-2 py-2 pr-4 shadow-[0_10px_30px_var(--prof-shadow-soft)] transition hover:border-[color:var(--prof-border-strong)] hover:from-[var(--prof-bg-chip-hover)] hover:via-[var(--prof-bg-elevated)]"
            >
              <Logo size={42} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.32em] text-cyan-200 transition group-hover:text-cyan-100">Profynus</p>
                <p className="truncate text-xs text-slate-400">Music platform workspace</p>
              </div>
            </Link>

            <div className="hidden items-center gap-2 rounded-full border border-[color:var(--prof-border)] bg-[var(--prof-bg-chip)] px-3 py-2 text-xs uppercase tracking-[0.22em] text-cyan-100/80 2xl:flex">
              <Sparkles size={14} className="text-cyan-300" />
              Weekly competition live
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="hidden items-center gap-2 rounded-full border border-[color:var(--prof-border)] bg-linear-to-r from-[var(--prof-bg-chip)] to-[var(--prof-bg-base)] px-3 py-2 text-sm text-slate-300 xl:flex">
              <Clock3 size={16} className="text-cyan-300" />
              <span className="font-mono text-cyan-200">{formattedTime}</span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-[color:var(--prof-border)] bg-[var(--prof-bg-panel)] text-slate-300 transition hover:border-[color:var(--prof-border-strong)] hover:bg-[var(--prof-bg-chip)] hover:text-cyan-200 xl:flex"
              aria-label="Open account"
            >
              <Bell size={18} />
            </button>

            <div className="flex items-center gap-3 rounded-full border border-[color:var(--prof-border)] bg-linear-to-r from-[var(--prof-bg-chip)] via-[var(--prof-bg-base)] to-[var(--prof-bg-elevated)] px-3 py-2 shadow-[0_12px_26px_var(--prof-shadow-soft)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-cyan-200 to-cyan-400 text-sm font-semibold text-slate-950">
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
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--prof-danger-border)] bg-linear-to-r from-[var(--prof-danger-bg)] to-[var(--prof-bg-base)] px-4 py-2 text-sm font-medium text-red-100 transition hover:border-red-700/50 hover:from-red-900/80 hover:to-[var(--prof-bg-elevated)]"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--prof-border)] bg-[var(--prof-bg-panel)] text-cyan-300 transition hover:border-[color:var(--prof-border-strong)] hover:bg-[var(--prof-bg-chip)] lg:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className="hidden border-t border-[color:var(--prof-border)] py-3 lg:flex lg:justify-center">
          <nav className="w-full overflow-x-auto">
            <div className="mx-auto flex w-max items-center gap-2 rounded-full border border-[color:var(--prof-border)] bg-linear-to-r from-[var(--prof-bg-base)] via-[var(--prof-bg-elevated)] to-[var(--prof-bg-base)] p-2 shadow-[0_18px_50px_var(--prof-shadow-strong)] ring-1 ring-[color:var(--prof-border)]">
              {navigationItems.map((item) => (
                <DesktopNavLink key={item.href} {...item} />
              ))}
            </div>
          </nav>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-[color:var(--prof-border)] py-4 lg:hidden">
            <div className="space-y-4 rounded-[28px] border border-[color:var(--prof-border)] bg-[var(--prof-bg-elevated-strong)] p-4 shadow-[0_20px_60px_var(--prof-shadow-strong)]">
              <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--prof-border)] bg-[var(--prof-bg-chip)] p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400 text-sm font-semibold text-slate-950">
                  {avatarLabel}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{displayName}</p>
                  <p className="truncate text-xs text-slate-400">{emailLabel}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--prof-border)] bg-[var(--prof-bg-panel)] px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-300">
                  <Clock3 size={14} className="text-cyan-300" />
                  {formattedTime}
                </div>
              </div>

              <nav className="grid gap-2">
                {navigationItems.map((item) => (
                  <MobileNavLink key={item.href} {...item} onNavigate={() => setIsMenuOpen(false)} />
                ))}
              </nav>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate("/profile")
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--prof-border)] bg-[var(--prof-bg-panel)] px-4 py-3 text-sm font-medium text-white transition hover:border-[color:var(--prof-border-strong)] hover:bg-[var(--prof-bg-chip)]"
                >
                  <UserRound size={16} />
                  Account
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--prof-danger-border)] bg-[var(--prof-danger-bg)] px-4 py-3 text-sm font-medium text-red-100 transition hover:border-red-700/50 hover:bg-red-900/50"
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
          "relative rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-300",
          isActive
            ? "bg-linear-to-r from-cyan-300 via-cyan-400 to-sky-300 text-slate-950 shadow-[0_12px_28px_rgba(34,211,238,0.32)]"
            : "text-slate-300 hover:bg-[var(--prof-bg-chip)] hover:text-cyan-100",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  )
}

function MobileNavLink({ href, label, onNavigate }) {
  return (
    <NavLink
      to={href}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-300",
          isActive
            ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-200"
            : "border-[color:var(--prof-border)] bg-[var(--prof-bg-panel)] text-white hover:border-[color:var(--prof-border-strong)] hover:bg-[var(--prof-bg-chip)]",
        ].join(" ")
      }
    >
      <span>{label}</span>
      <span className="text-xs uppercase tracking-[0.22em] text-slate-400">Open</span>
    </NavLink>
  )
}