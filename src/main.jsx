import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'

// External dependencies
import { Toaster } from 'sileo'


// Pages and routes
import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/login/Login'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* Public paths */}
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
    </Routes>
    <Toaster position='top-center'/>
  </BrowserRouter>
)
