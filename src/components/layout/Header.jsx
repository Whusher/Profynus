import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router"
import { Bell, Clock3, LogOut, Menu, Settings2, Sparkles, UserRound, X } from "lucide-react"
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
  const headerRef = useRef(null)
  const lastScrollYRef = useRef(0)
  const animationFrameRef = useRef(0)

  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

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
    const updateHeaderHeight = () => {
      setHeaderHeight(headerRef.current?.offsetHeight || 0)
    }

    updateHeaderHeight()

    if (typeof window === "undefined") {
      return undefined
    }

    window.addEventListener("resize", updateHeaderHeight)

    if (typeof ResizeObserver === "undefined" || !headerRef.current) {
      return () => window.removeEventListener("resize", updateHeaderHeight)
    }

    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight()
    })

    resizeObserver.observe(headerRef.current)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateHeaderHeight)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined
    }

    lastScrollYRef.current = window.scrollY

    const updateHeaderVisibility = () => {
      const nextScrollY = window.scrollY

      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = window.requestAnimationFrame(() => {
        const previousScrollY = lastScrollYRef.current
        const scrollDelta = nextScrollY - previousScrollY

        if (isMenuOpen || nextScrollY <= 24 || scrollDelta < -6) {
          setIsHeaderVisible(true)
        } else if (scrollDelta > 6) {
          setIsHeaderVisible(false)
        }

        lastScrollYRef.current = nextScrollY
        animationFrameRef.current = 0
      })
    }

    window.addEventListener("scroll", updateHeaderVisibility, { passive: true })

    return () => {
      window.removeEventListener("scroll", updateHeaderVisibility)

      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isMenuOpen])

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
    <>
      <div aria-hidden="true" style={{ height: headerHeight }} />
      <header
        ref={headerRef}
        className={[
          "fixed inset-x-0 top-0 z-40 border-b border-(--prof-border) bg-(--prof-bg-base)/90 backdrop-blur-xl transition-transform duration-300 ease-out",
          isHeaderVisible ? "translate-y-0" : "-translate-y-full",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:max-w-352 lg:px-8 2xl:max-w-384 2xl:px-10">
          <div className="flex min-h-20 items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/home"
              className="group flex items-center gap-3 rounded-full border border-(--prof-border) bg-linear-to-r from-(--prof-bg-chip) via-(--prof-bg-base) to-(--prof-bg-base) px-2 py-2 pr-4 shadow-[0_10px_30px_var(--prof-theme-halo-1)] transition hover:border-(--prof-border-strong) "
            >
              <Logo size={42} />
              <div className="min-w-0">
                <p style={{ fontFamily: 'Audiowide, sans-serif' }} 
                  className="truncate text-sm uppercase tracking-[0.32em] text-(--prof-accent-strong) transition ">Profynus</p>
                <p className="truncate text-xs text-slate-400">Music platform workspace</p>
              </div>
            </Link>

          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="hidden items-center gap-2 rounded-full border-(--prof-border) bg-linear-to-r from-(--prof-bg-chip) to-(--prof-bg-base) px-3 py-2 text-sm text-slate-300 xl:flex">
              <Clock3 size={16} className="text-(--prof-accent)" />
              <span className="font-mono text-(--prof-accent-strong)">{formattedTime}</span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="hidden h-11 w-11 items-center justify-center rounded-full border-(--prof-border) bg-(--prof-bg-panel) text-slate-300 transition hover:border-(--prof-border-strong) hover:bg-(--prof-bg-chip) hover:text-(--prof-accent) lg:flex"
              aria-label="Open settings"
            >
              <Settings2 size={18} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="hidden h-11 w-11 items-center justify-center rounded-full border-(--prof-border) bg-(--prof-bg-panel) text-slate-300 transition hover:border-(--prof-border-strong) hover:text-(--prof-accent) lg:flex"
              aria-label="Open account"
            >
              <Bell size={18} />
            </button>

            <div className="flex items-center gap-3 rounded-full border-(--prof-border) px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-(--prof-accent-strong) to-(--prof-accent) text-sm font-semibold text-slate-950">
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
              className="inline-flex items-center gap-2 rounded-full border-(--prof-danger-border) bg-linear-to-r from-(--prof-danger-bg) to-(--prof-bg-base) px-4 py-2 text-sm font-medium text-red-100 transition hover:border-red-700/50 hover:from-red-900/80 hover:to-(--prof-bg-elevated)"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-(--prof-border) bg-(--prof-bg-panel) text-(--prof-accent) transition hover:border-(--prof-border-strong) lg:hidden"
            onClick={() => {
              setIsMenuOpen((open) => !open)
              setIsHeaderVisible(true)
            }}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

          <div className="hidden border-t border-(--prof-border) py-3 lg:flex lg:justify-center">
            <nav className="w-full overflow-x-auto">
              <div className="mx-auto flex w-max items-center gap-2 rounded-full border-(--prof-border) bg-linear-to-r from-(--prof-bg-base) via-(--prof-bg-elevated) to-(--prof-bg-base) p-2 shadow-[0_18px_50px_var(--prof-shadow-strong)] ring-1 ring-(--prof-border)">
                {navigationItems.map((item) => (
                  <DesktopNavLink key={item.href} {...item} />
                ))}
              </div>
            </nav>
          </div>

          {isMenuOpen ? (
            <div className="border-t border-(--prof-border) py-4 lg:hidden">
              <div className="space-y-4 rounded-[28px] border-(--prof-border) bg-(--prof-bg-elevated-strong) p-4 shadow-[0_20px_60px_var(--prof-shadow-strong)]">
                <div className="flex items-center gap-3 rounded-2xl border-(--prof-border) bg-(--prof-bg-chip) p-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--prof-accent) text-sm font-semibold text-slate-950">
                    {avatarLabel}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{displayName}</p>
                    <p className="truncate text-xs text-slate-400">{emailLabel}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border-(--prof-border) bg-(--prof-bg-panel) px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-300">
                    <Clock3 size={14} className="text-(--prof-accent)" />
                    {formattedTime}
                  </div>
                </div>

                <div className="rounded-2xl border-(--prof-border) bg-(--prof-bg-panel) p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Shortcuts</p>
                      <p className="text-sm text-white">Open the controls you use most</p>
                    </div>
                    <Settings2 size={16} className="text-(--prof-accent)" />
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { label: "Settings", icon: Settings2, href: "/settings" },
                      { label: "Account", icon: Bell, href: "/profile" },
                    ].map((shortcut) => (
                      <button
                        key={shortcut.label}
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false)
                          navigate(shortcut.href)
                        }}
                        className={[
                          "flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition",
                          "border-(--prof-border) bg-(--prof-bg-base) text-slate-300 hover:border-(--prof-border-strong) hover:text-white",
                        ].join(" ")}
                      >
                        <shortcut.icon size={18} className="text-(--prof-accent)" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">{shortcut.label}</span>
                          <span className="block truncate text-[11px] uppercase tracking-[0.18em] text-slate-400">Open now</span>
                        </span>
                        <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Open</span>
                      </button>
                    ))}
                  </div>
                </div>

                <nav className="grid gap-2">
                  {navigationItems.map((item) => (
                    <MobileNavLink
                      key={item.href}
                      {...item}
                      onNavigate={() => {
                        setIsMenuOpen(false)
                      }}
                    />
                  ))}
                </nav>

                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false)
                      navigate("/settings")
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border-(--prof-border) bg-(--prof-bg-panel) px-4 py-3 text-sm font-medium text-white transition hover:border-(--prof-border-strong)"
                  >
                    <Settings2 size={16} />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border-(--prof-danger-border) bg-(--prof-danger-bg) px-4 py-3 text-sm font-medium text-red-100 transition hover:border-red-700/50 hover:bg-red-900/50"
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
    </>
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
            ? "text-slate-300 bg-linear-to-r from-(--prof-accent-strong) to-(--prof-accent-soft) font-bold"
            : "text-slate-300 hover:text-(--prof-accent-strong)",
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
            ? "border-(--prof-border-strong) bg-(--prof-accent-soft) text-(--prof-accent-strong)"
            : "border-(--prof-border) bg-(--prof-bg-panel) text-white hover:border-(--prof-border-strong) hover:bg-(--prof-bg-chip)",
        ].join(" ")
      }
    >
      <span>{label}</span>
      <span className="text-xs uppercase tracking-[0.22em] text-slate-400">Open</span>
    </NavLink>
  )
}