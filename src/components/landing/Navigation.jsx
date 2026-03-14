import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router"
import { Menu, X } from 'lucide-react'
import Logo from "../layout/Logo"

/**
 * Navigation bar with responsive mobile menu
 */
export default function Navigation({ onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="relative z-50">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Logo />
          <span className="text-2xl font-bold ml-2 bg-linear-to-r from-cyan-400 to-cyan-200 text-transparent bg-clip-text" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            Profynus Music
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="/signup">Features</NavLink>
          <NavLink href="/signup">How It Works</NavLink>
          <NavLink href="/signup">Music</NavLink>
          <NavLink href="/login">Login</NavLink>
          <motion.button
            onClick={() => onNavigate('/signup')}
            className="bg-cyan-500 text-black px-6 py-2 rounded-full font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>
        
        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-black border-t border-cyan-900/50 z-50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <MobileNavLink href="/signup" onClick={() => setIsMenuOpen(false)}>Features</MobileNavLink>
              <MobileNavLink href="/signup" onClick={() => setIsMenuOpen(false)}>How It Works</MobileNavLink>
              <MobileNavLink href="/signup" onClick={() => setIsMenuOpen(false)}>Music</MobileNavLink>
              <MobileNavLink href="/signup" onClick={() => setIsMenuOpen(false)}>Download</MobileNavLink>
              <motion.button
                onClick={() => {
                  onNavigate('/signup')
                  setIsMenuOpen(false)
                }}
                className="bg-cyan-500 text-black px-6 py-3 rounded-full font-medium w-full"
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function NavLink({ href, children }) {
  return (
    <Link to={href} className="text-gray-300 hover:text-cyan-400 transition-colors">
      {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <Link 
      to={href} 
      className="text-gray-300 hover:text-cyan-400 transition-colors block py-2 border-b border-gray-800"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
