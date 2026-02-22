import { motion } from "framer-motion"

/**
 * Card component to display a feature with icon, title, and description
 */
export default function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      className="bg-gradient-to-br from-black to-cyan-950/10 p-8 rounded-xl border border-cyan-900/30 hover:border-cyan-500/50 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="bg-cyan-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}
