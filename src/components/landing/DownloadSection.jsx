import { motion } from "framer-motion"

/**
 * Download section with call-to-action
 */
export default function DownloadSection({ onNavigate }) {
  return (
    <section id="download" className="py-20 bg-gradient-to-b from-black via-cyan-950/10 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent opacity-70"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Experience <span className="text-cyan-400">Profynus</span>?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of music lovers who have already discovered the ultimate music experience. Download Profynus today!
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="bg-transparent border border-cyan-500 text-cyan-400 px-8 py-4 rounded-xl font-medium flex items-center gap-3 text-lg"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(8, 145, 178, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('/signup')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="7" y1="12" x2="17" y2="12"></line>
                <line x1="12" y1="7" x2="12" y2="17"></line>
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-80">Access on</div>
                <div>Web Browser</div>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
