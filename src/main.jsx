import './index.css'
import { useEffect, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import { useShallow } from 'zustand/react/shallow'

// External dependencies
import { Toaster } from 'sileo'
import { DEFAULT_THEME, isThemeValue } from '@features/theme/themes'
import { useSettingsStore, useThemeStore } from '@store/index'
import ProtectedRoute from '@components/layout/ProtectedRoute'
import RouteLoader from '@components/layout/RouteLoader'


// Pages and routes
const LandingPage = lazy(() => import('@pages/landing/LandingPage'))
const LoginPage = lazy(() => import('@pages/login/Login'))
const SignUpPage = lazy(() => import('@pages/signup/SignUp'))
const HomePage = lazy(() => import('@pages/home/HomePage'))
const FeedPage = lazy(() => import('@pages/feed/FeedPage'))
const FriendsPage = lazy(() => import('@pages/friends/FriendsPage'))
const AccountPage = lazy(() => import('@pages/account/AccountPage'))
const HistoryPage = lazy(() => import('@pages/history/HistoryPage'))
const MusicPlayerPage = lazy(() => import('@pages/music-player/MusicPlayerPage'))
const SettingsPage = lazy(() => import('@pages/settings/SettingsPage'))
const FloatingMusicPlayer = lazy(() => import('@components/music/FloatingMusicPlayer'))

const renderLazyRoute = (element) => <Suspense fallback={<RouteLoader />}>{element}</Suspense>

function applyTheme(theme) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.profTheme = isThemeValue(theme) ? theme : DEFAULT_THEME
  document.documentElement.style.colorScheme = 'dark'
}

function applyPreferences(preferences) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.profReduceMotion = preferences?.reducedMotion ? 'true' : 'false'
  document.documentElement.dataset.profCompactLayout = preferences?.compactLayout ? 'true' : 'false'
}

function readPersistedState(key) {
  try {
    const rawValue = localStorage.getItem(key)
    if (!rawValue) {
      return null
    }

    const parsedValue = JSON.parse(rawValue)
    return parsedValue?.state ?? null
  } catch {
    return null
  }
}

try {
  const storedTheme = localStorage.getItem('profynus-theme')
  applyTheme(storedTheme)
  applyPreferences(readPersistedState('profynus-settings'))
} catch {
  applyTheme(DEFAULT_THEME)
}

function ShellSync() {
  const theme = useThemeStore((state) => state.theme)
  const preferences = useSettingsStore(
    useShallow((state) => ({
      reducedMotion: state.reducedMotion,
      compactLayout: state.compactLayout,
    }))
  )

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    applyPreferences(preferences)
  }, [preferences])

  return null
}

const rootElement = document.getElementById('root')
const appRoot = globalThis.__profynusAppRoot ?? createRoot(rootElement)
globalThis.__profynusAppRoot = appRoot

appRoot.render(
  <BrowserRouter>
    <ShellSync />
    <Routes>
      {/* Public paths */}
      <Route path='/' element={renderLazyRoute(<LandingPage/>)} />
      <Route path='/login' element={renderLazyRoute(<LoginPage/>)} />
      <Route path='/signup' element={renderLazyRoute(<SignUpPage/>)} />
      {/* Private paths */}
      <Route path='/home' element={renderLazyRoute(<ProtectedRoute><HomePage/></ProtectedRoute>)} />
      <Route path='/feed' element={renderLazyRoute(<ProtectedRoute><FeedPage/></ProtectedRoute>)} />
      <Route path='/friends' element={renderLazyRoute(<ProtectedRoute><FriendsPage/></ProtectedRoute>)} />
      <Route path='/profile' element={renderLazyRoute(<ProtectedRoute><AccountPage/></ProtectedRoute>)} />
      <Route path='/history' element={renderLazyRoute(<ProtectedRoute><HistoryPage/></ProtectedRoute>)} />
      <Route path='/moremusic' element={renderLazyRoute(<ProtectedRoute><MusicPlayerPage/></ProtectedRoute>)} />
      <Route path='/settings' element={renderLazyRoute(<ProtectedRoute><SettingsPage/></ProtectedRoute>)} />
      <Route path='*' element={<Navigate to='/' replace />}/>
    </Routes>
    <Toaster position='top-center' options={{fill: "#171D1F"}}/>
    <Suspense fallback={null}>
      <FloatingMusicPlayer />
    </Suspense>
  </BrowserRouter>
)
