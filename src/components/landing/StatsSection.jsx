import StatCard from "./StatCard"

/**
 * Statistics section showing platform metrics
 */
export default function StatsSection() {
  const stats = [
    { number: "10M+", label: "Downloads" },
    { number: "5M+", label: "Users" },
    { number: "500K+", label: "Songs" },
    { number: "100K+", label: "Playlists" }
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <StatCard key={index} number={stat.number} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
