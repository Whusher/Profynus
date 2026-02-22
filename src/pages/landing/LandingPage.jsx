import { useNavigate } from "react-router"

// Import Section Components
import Navigation from "@/components/landing/Navigation"
import HeroSection from "@/components/landing/HeroSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import MusicShowcaseSection from "@/components/landing/MusicShowcaseSection"
import StatsSection from "@/components/landing/StatsSection"
import DownloadSection from "@/components/landing/DownloadSection"
import Footer from "@/components/landing/Footer"

/**
 * Landing Page - Main entry point for new users
 * 
 * Structure:
 * - Navigation: Header with logo, menu, and sign-up button
 * - Hero: Main value proposition with CTA buttons
 * - Features: Key features showcase with auto-rotating display
 * - How It Works: Step-by-step guide (3 steps)
 * - Music Showcase: Featured playlists
 * - Stats: Platform metrics (downloads, users, songs, playlists)
 * - Download: Call-to-action section
 * - Footer: Links, social media, and newsletter signup
 */
export default function LandingPage() {
  const navigate = useNavigate()

  const handleNavigation = (path = '/') => {
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navigation onNavigate={handleNavigation} />
      <HeroSection onNavigate={handleNavigation} />
      <FeaturesSection />
      <HowItWorksSection />
      <MusicShowcaseSection />
      <StatsSection />
      <DownloadSection onNavigate={handleNavigation} />
      <Footer />
    </div>
  )
}