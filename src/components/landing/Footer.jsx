import { motion } from "framer-motion"
import { Link } from "react-router"
import { ChevronRight, Twitter, Instagram, Github } from 'lucide-react'
import Logo from "./Logo"

/**
 * Footer with links, social media, and newsletter signup
 */
export default function Footer() {
  return (
    <footer className="py-12 bg-black border-t border-cyan-900/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <Logo size={48} />
              <span className="text-xl font-bold ml-2 bg-linear-to-r from-cyan-400 to-cyan-200 text-transparent bg-clip-text" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                Profynus
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Your ultimate music companion. Download, listen, and create amazing playlists.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Github size={18} />} />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#how-it-works">How It Works</FooterLink>
              <FooterLink href="#showcase">Music</FooterLink>
              <FooterLink href="#download">Download</FooterLink>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
              <FooterLink href="#">FAQs</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get updates on new features and music releases.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-900 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button className="bg-cyan-500 text-black px-4 py-2 rounded-r-md hover:bg-cyan-400 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Profynus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ icon }) {
  return (
    <motion.a 
      href="#" 
      className="bg-cyan-900/30 p-2 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.a>
  )
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link 
        to={href} 
        className="text-gray-400 hover:text-cyan-400 transition-colors"
      >
        {children}
      </Link>
    </li>
  )
}
