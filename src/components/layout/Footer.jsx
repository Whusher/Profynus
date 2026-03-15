import { motion } from "framer-motion"
import { Link } from "react-router"
import { ChevronRight, Twitter, Instagram, Github } from 'lucide-react'
import Logo from "./Logo"

/**
 * Footer with links, social media, and newsletter signup
 */
const landingQuickLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Music", href: "#showcase" },
  { label: "Download", href: "#download" },
]

const appQuickLinks = [
  { label: "Home", href: "/home" },
  { label: "Feed", href: "/feed" },
  { label: "Friends", href: "/friends" },
  { label: "History", href: "/history" },
]

const landingSupportLinks = [
  { label: "Help Center", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "FAQs", href: "#" },
  { label: "Privacy Policy", href: "#" },
]

const appSupportLinks = [
  { label: "Account", href: "/profile" },
  { label: "Music Player", href: "/moremusic" },
  { label: "Landing", href: "/" },
  { label: "Sign out flow", href: "/login" },
]

export default function Footer({ variant = "landing" }) {
  const isApp = variant === "app"
  const quickLinks = isApp ? appQuickLinks : landingQuickLinks
  const supportLinks = isApp ? appSupportLinks : landingSupportLinks

  return (
    <footer className="border-t border-[color:var(--prof-border)] bg-[var(--prof-bg-base)] py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:max-w-[88rem] lg:px-8 2xl:max-w-[96rem] 2xl:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <Logo size={48} />
              <span className="text-xl font-bold ml-2 bg-linear-to-r from-cyan-400 to-cyan-200 text-transparent bg-clip-text" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                Profynus
              </span>
            </div>
            <p className="mb-4 text-[var(--prof-text-muted)]">
              {isApp
                ? "A focused workspace for streaming, discovery, competition tracking, and social music activity."
                : "Your ultimate music companion. Download, listen, and create amazing playlists."}
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
              {quickLinks.map((item) => (
                <FooterLink key={item.label} href={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold mb-4">{isApp ? "Workspace" : "Support"}</h3>
            <ul className="space-y-2">
              {supportLinks.map((item) => (
                <FooterLink key={item.label} href={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
          
          {/* CTA */}
          <div>
            <h3 className="text-white font-bold mb-4">{isApp ? "Next Action" : "Newsletter"}</h3>
            {isApp ? (
              <div className="rounded-3xl border border-[color:var(--prof-border)] bg-[var(--prof-bg-panel)] p-5">
                <p className="mb-4 text-sm leading-6 text-[var(--prof-text-muted)]">
                  Jump back into discovery, review your social activity, or continue shaping your profile.
                </p>
                <Link
                  to="/feed"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
                >
                  Open feed
                  <ChevronRight size={18} />
                </Link>
              </div>
            ) : (
              <>
                <p className="mb-4 text-[var(--prof-text-muted)]">
                  Subscribe to get updates on new features and music releases.
                </p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="w-full rounded-l-md border border-[color:var(--prof-border)] bg-[var(--prof-bg-panel)] px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <button className="rounded-r-md bg-cyan-500 px-4 py-2 text-black transition-colors hover:bg-cyan-400">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-[color:var(--prof-border)] pt-8 text-center text-sm text-[var(--prof-text-muted)]">
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
      className="rounded-full bg-[var(--prof-bg-chip)] p-2 text-cyan-400 transition-colors hover:bg-cyan-500 hover:text-black"
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
        className="text-[var(--prof-text-muted)] transition-colors hover:text-cyan-400"
      >
        {children}
      </Link>
    </li>
  )
}
