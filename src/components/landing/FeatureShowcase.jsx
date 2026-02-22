import { motion } from "framer-motion"
import { ChevronRight } from 'lucide-react'

/**
 * Feature showcase component with animated transitions
 */
export default function FeatureShowcase({ title, description, image, icon }) {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col md:flex-row items-center p-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
        <div className="flex items-center mb-4">
          <div className="bg-cyan-500 p-2 rounded-lg mr-3">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 mb-6">{description}</p>
        <motion.button
          className="bg-cyan-500 text-black px-6 py-2 rounded-lg font-medium flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Learn More <ChevronRight size={18} />
        </motion.button>
      </div>
      <div className="md:w-1/2">
        <img 
          src={image || "/placeholder.svg"} 
          alt={title} 
          className="rounded-lg shadow-lg border border-cyan-900/30"
        />
      </div>
    </motion.div>
  )
}
