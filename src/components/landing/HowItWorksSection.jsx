import SectionHeader from "./SectionHeader"
import StepCard from "./StepCard"

/**
 * "How It Works" section explaining the process
 */
export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your free account in seconds and get access to all features."
    },
    {
      number: "02",
      title: "Discover Music",
      description: "Browse our extensive library and find your favorite songs and artists."
    },
    {
      number: "03",
      title: "Enjoy & Share",
      description: "Download, listen and create playlists to share with friends."
    }
  ]

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="How It Works"
          subtitle="Get started with Profynus in three simple steps"
        />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}
