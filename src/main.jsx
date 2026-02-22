import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'

import LandingPage from './pages/landing/LandingPage'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* Public paths */}
      <Route path='/' element={<LandingPage/>}/>
    </Routes>
  </BrowserRouter>
)
