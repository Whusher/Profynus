import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'

// External dependencies
import { Toaster } from 'sileo'


// Pages and routes
import LandingPage from '@pages/landing/LandingPage'
import LoginPage from '@pages/login/Login'
import SignUpPage from '@pages/signup/SignUp'
import HomePage from '@pages/home/HomePage'
import FeedPage from '@pages/feed/FeedPage'
import FriendsPage from '@pages/friends/FriendsPage'
import AccountPage from '@pages/account/AccountPage'
import HistoryPage from '@pages/history/HistoryPage'
import MusicPlayerPage from '@pages/music-player/MusicPlayerPage'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* Public paths */}
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignUpPage/>}/>
      {/* Private paths */}
      <Route path='/home' element={<HomePage/>}/>
      <Route path='/feed' element={<FeedPage/>}/>
      <Route path='/friends' element={<FriendsPage/>}/>
      <Route path='/profile' element={<AccountPage/>}/>
      <Route path='/history' element={<HistoryPage/>}/>
      <Route path='/moremusic' element={<MusicPlayerPage/>}/>
      <Route path='*' element={<Navigate to='/' replace />}/>
    </Routes>
    <Toaster position='top-center'/>
  </BrowserRouter>
)
