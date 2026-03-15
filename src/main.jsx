import './index.css'
import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'

// External dependencies
import { Toaster } from 'sileo'
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

const renderLazyRoute = (element) => <Suspense fallback={<RouteLoader />}>{element}</Suspense>

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='./'>
    <Routes>
      {/* Public paths */}
      <Route path='/' element={renderLazyRoute(<LandingPage/>)} />
      <Route path='/login' element={renderLazyRoute(<LoginPage/>)} />
      <Route path='/signup' element={renderLazyRoute(<SignUpPage/>)} />
      {/* Private paths */}
      <Route path='/home' element={renderLazyRoute(<HomePage/>)} />
      <Route path='/feed' element={renderLazyRoute(<FeedPage/>)} />
      <Route path='/friends' element={renderLazyRoute(<FriendsPage/>)} />
      <Route path='/profile' element={renderLazyRoute(<AccountPage/>)} />
      <Route path='/history' element={renderLazyRoute(<HistoryPage/>)} />
      <Route path='/moremusic' element={renderLazyRoute(<MusicPlayerPage/>)} />
      <Route path='*' element={<Navigate to='/' replace />}/>
    </Routes>
    <Toaster position='top-center'/>
  </BrowserRouter>
)
