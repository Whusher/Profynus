import { motion } from "framer-motion"

/**
 * Step card for "How It Works" section
 */
export default function StepCard({ number, title, description }) {
  return (
    <motion.div 
      className="relative p-8 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="absolute -top-10 left-8 text-6xl font-bold text-cyan-500/20">{number}</div>
      <div className="bg-gradient-to-br from-black to-cyan-950/10 p-8 rounded-xl border border-cyan-900/30 relative z-10">
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  )
}
