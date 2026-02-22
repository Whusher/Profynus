import { motion } from "framer-motion"
import logo from "@assets/images/main-wolf-hd.webp"
// import logo from "@assets/images/main-wolf.png"

/**
 * Logo component with animated hover effect
 * @param {number} size - Size of the logo in pixels (default: 72)
 */
export default function Logo({ size = 72 }) {
  return (
    <motion.div 
      className="relative"
      whileHover={{ rotate: 10 }}

    >
      <img 
        src={logo} alt="logo-image"
        className="rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
      />
    </motion.div>
  )
}
