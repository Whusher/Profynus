import { motion } from "framer-motion"
import { ChevronRight } from 'lucide-react'
import SectionHeader from "./SectionHeader"
import PlaylistCard from "./PlaylistCard"

/**
 * Music showcase section displaying featured playlists
 */
export default function MusicShowcaseSection() {
  const playlists = [
    { title: "Top Hits", songs: 24, image: "/placeholder.svg?height=300&width=300" },
    { title: "Chill Vibes", songs: 18, image: "/placeholder.svg?height=300&width=300" },
    { title: "Workout Mix", songs: 15, image: "/placeholder.svg?height=300&width=300" },
    { title: "Study Focus", songs: 20, image: "/placeholder.svg?height=300&width=300" }
  ]

  return (
    <section id="showcase" className="py-20 bg-gradient-to-b from-black to-cyan-950/10 to-black">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Music Showcase"
          subtitle="Explore some of our featured playlists and tracks"
        />
        
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {playlists.map((playlist, index) => (
              <PlaylistCard
                key={index}
                title={playlist.title}
                songs={playlist.songs}
                image={playlist.image}
                index={index}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <motion.button
              className="bg-cyan-500 text-black px-8 py-3 rounded-full font-medium inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore All Music <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
