import { motion } from "framer-motion"

/**
 * Reusable section header with title and subtitle
 */
export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <motion.h2 
        className="text-3xl md:text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <span className="text-cyan-400">{title.split(' ')[0]}</span>{' '}
        {title.split(' ').slice(1).join(' ')}
      </motion.h2>
      
      <motion.p 
        className="text-xl text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {subtitle}
      </motion.p>
    </div>
  )
}
