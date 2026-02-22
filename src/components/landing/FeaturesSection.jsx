import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Headphones, ListMusic, ChevronRight } from 'lucide-react'
import SectionHeader from "./SectionHeader"
import FeatureCard from "./FeatureCard"
import FeatureShowcase from "./FeatureShowcase"

/**
 * Features section with rotating feature showcase
 */
export default function FeaturesSection() {
  const [currentFeature, setCurrentFeature] = useState(0)

  // Auto-rotate features every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Download className="text-cyan-400" size={32} />,
      title: "Download Music",
      description: "Download your favorite songs in high quality and listen offline anytime, anywhere."
    },
    {
      icon: <Headphones className="text-cyan-400" size={32} />,
      title: "Listen Anywhere",
      description: "Stream music online or listen to your downloaded tracks with our powerful audio player."
    },
    {
      icon: <ListMusic className="text-cyan-400" size={32} />,
      title: "Create Playlists",
      description: "Organize your music into custom playlists for every mood, activity or occasion."
    }
  ]

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-black to-cyan-950/10 to-black">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Amazing Features"
          subtitle="Everything you need for the perfect music experience"
        />
        
        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        
        {/* Feature Showcase with Auto-rotation */}
        <div className="mt-20">
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.button
                  key={i}
                  className={`w-3 h-3 rounded-full ${currentFeature === i ? 'bg-cyan-400' : 'bg-gray-700'}`}
                  onClick={() => setCurrentFeature(i)}
                  whileHover={{ scale: 1.2 }}
                  aria-label={`Show feature ${i + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-cyan-900/20 to-black rounded-xl overflow-hidden border border-cyan-900/30">
            <AnimatePresence mode="wait">
              {currentFeature === 0 && (
                <FeatureShowcase
                  key="download"
                  title="Download Your Favorite Music"
                  description="Get instant access to millions of songs. Download and enjoy high-quality audio without interruptions."
                  image="/placeholder.svg?height=400&width=600"
                  icon={<Download size={24} />}
                />
              )}
              
              {currentFeature === 1 && (
                <FeatureShowcase
                  key="listen"
                  title="Listen Anywhere, Anytime"
                  description="Take your music everywhere. Listen on any device with our seamless cross-platform experience."
                  image="/placeholder.svg?height=400&width=600"
                  icon={<Headphones size={24} />}
                />
              )}
              
              {currentFeature === 2 && (
                <FeatureShowcase
                  key="playlists"
                  title="Create Perfect Playlists"
                  description="Organize your music your way. Create, edit and share playlists with friends and family."
                  image="/placeholder.svg?height=400&width=600"
                  icon={<ListMusic size={24} />}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
