import { motion } from "framer-motion"
import { Play, ChevronRight } from 'lucide-react'
import MusicParticles from "./MusicParticles"

/**
 * Hero section with call-to-action buttons
 */
export default function HeroSection({ onNavigate }) {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyan-900/20 to-transparent"></div>
        <div className="absolute inset-0">
          <MusicParticles />
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Your Music, <br />
              <span className="text-cyan-400">Your Way</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Download, listen, and create amazing playlists with Profynus. 
              The ultimate music experience that puts you in control.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.button
                onClick={() => onNavigate('/signup')}
                className="bg-cyan-500 text-black px-8 py-3 rounded-full font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started <ChevronRight size={18} />
              </motion.button>
              <motion.button
                onClick={() => onNavigate('/signup')}
                className="bg-transparent border border-cyan-500 text-cyan-400 px-8 py-3 rounded-full font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(8, 145, 178, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={18} fill="currentColor" /> Download on Desktop
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span>Trusted by</span>
              <span className="text-cyan-400 font-bold">10,000+</span>
              <span>music lovers</span>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 relative">
            {/* App preview placeholder */}
          </div>
        </div>
      </div>
    </section>
  )
}
