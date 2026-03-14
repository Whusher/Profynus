import { motion } from "framer-motion"
import { Music, Headphones, Volume2 } from 'lucide-react'

/**
 * Animated music-themed particles for background effect
 */
export default function MusicParticles({particlesPreference = 20}) {
  return (
    <div className="absolute inset-0">
      {[...Array(particlesPreference)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 text-cyan-500/30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 20,
          }}
        >
          {i % 3 === 0 ? (
            <Music size={24} />
          ) : i % 3 === 1 ? (
            <Headphones size={24} />
          ) : (
            <Volume2 size={24} />
          )}
        </motion.div>
      ))}
    </div>
  )
}
