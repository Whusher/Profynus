import { motion } from "framer-motion"

/**
 * Statistics card for displaying metrics
 */
export default function StatCard({ number, label }) {
  return (
    <motion.div 
      className="p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h3 className="text-4xl font-bold text-cyan-400 mb-2">{number}</h3>
      <p className="text-gray-400">{label}</p>
    </motion.div>
  )
}
