import Layout from "@components/layout/Layout"
import AppPageTemplate, {
  TemplateCard,
  TemplateList,
} from "@components/layout/AppPageTemplate"

export default function FriendsPage() {
  return <Layout><FriendsContent /></Layout>
}

function FriendsContent() {
  return (
    <AppPageTemplate
      eyebrow="Friends"
      title="Design the social layer around shared taste and repeat listening."
      description="Friends should feel like a relationship map for music discovery: requests, mutual favorites, listening overlap, and shared playlists that deepen retention."
      actions={[
        { label: "Back to home", href: "/home", variant: "secondary" },
        { label: "Open account", href: "/profile" },
      ]}
      stats={[
        { label: "Friends", value: "128", change: "+6" },
        { label: "Pending requests", value: "14", change: "Needs review" },
        { label: "Shared playlists", value: "32", change: "+4" },
        { label: "Match score", value: "87%", change: "Top circle" },
      ]}
      aside={<FriendsAside />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <TemplateCard title="Connection states" description="Cover the full relationship lifecycle from discovery to accepted network membership.">
          <TemplateList items={connectionStates} />
        </TemplateCard>

        <TemplateCard title="Listening circles" description="Clusters of users who repeatedly engage with similar artists or playlists.">
          <TemplateList items={listeningCircles} />
        </TemplateCard>
      </div>

      <TemplateCard title="Shared taste opportunities" description="These modules help turn casual social contact into stronger platform habits.">
        <div className="grid gap-3 md:grid-cols-3">
          {friendTools.map((item) => (
            <div key={item.title} className="rounded-2xl border border-cyan-950/70 bg-slate-950/80 p-4">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </TemplateCard>
    </AppPageTemplate>
  )
}

function FriendsAside() {
  return (
    <>
      <TemplateCard title="Requests queue" description="Prioritize incoming relationships with context instead of a raw list of usernames.">
        <TemplateList items={requestQueue} />
      </TemplateCard>

      <TemplateCard title="Mutual energy" description="Signals showing where social discovery is strongest.">
        <TemplateList items={mutualEnergy} />
      </TemplateCard>
    </>
  )
}

const connectionStates = [
  { title: "Discover", description: "Show relevant people through mutual follows, genre affinity, and playlist overlap.", meta: "Find" },
  { title: "Request", description: "Send or accept connection requests with clear states and response prompts.", meta: "Connect" },
  { title: "Engage", description: "View activity from accepted friends, including new uploads and top reactions.", meta: "Track" },
  { title: "Collaborate", description: "Use shared playlists and music recommendations to deepen retention.", meta: "Grow" },
]

const listeningCircles = [
  { title: "Night drive circle", description: "Friends centered on synth, retro-pop, and cinematic playlists.", meta: "12 users" },
  { title: "Afro rhythm circle", description: "Users who repeatedly stream percussion-led dance releases.", meta: "19 users" },
  { title: "Indie breakout circle", description: "Listeners following emerging artists before they trend publicly.", meta: "8 users" },
]

const friendTools = [
  {
    title: "Shared queue",
    description: "A collaborative listening queue for friends planning what to stream next.",
  },
  {
    title: "Taste match meter",
    description: "A lightweight score that explains why two users should connect around music preferences.",
  },
  {
    title: "Recommendation swaps",
    description: "Direct peer-to-peer sharing of tracks that deserve a reaction or save.",
  },
]

const requestQueue = [
  { title: "Maya K", description: "91% taste overlap with your afro-house playlists.", meta: "New" },
  { title: "Sol Rivera", description: "Mutual friends with two creators you follow.", meta: "Mutual" },
  { title: "Theo V", description: "Shared engagement on last week's winning track.", meta: "Active" },
]

const mutualEnergy = [
  { title: "Same artist rotations", description: "24 friends replayed Nova Kairo this week.", meta: "Strong" },
  { title: "Playlist convergence", description: "Three circles are saving the same late-night mix.", meta: "High" },
  { title: "Recommendation response", description: "Shared tracks convert into saves 42% faster among friends.", meta: "Useful" },
]