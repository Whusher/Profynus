import { motion } from "framer-motion"
import { Play } from 'lucide-react'

/**
 * Playlist card with hover effects
 */
export default function PlaylistCard({ title, songs, image, index }) {
  return (
    <motion.div 
      className="group relative overflow-hidden rounded-xl cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-10"></div>
      
      <img 
        src={image || "/placeholder.svg"} 
        alt={title} 
        className="w-full aspect-square object-cover transition-transform group-hover:scale-110"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-cyan-400">{songs} songs</p>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <motion.button
          className="bg-cyan-500 text-black rounded-full p-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Play size={24} fill="currentColor" />
        </motion.button>
      </div>
    </motion.div>
  )
}
