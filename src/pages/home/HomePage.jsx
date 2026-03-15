import Layout from "@components/layout/Layout"
import AppPageTemplate, {
  TemplateCard,
  TemplateList,
} from "@components/layout/AppPageTemplate"
import { Link } from "react-router"
import { Disc3, Flame, Radio, Trophy } from "lucide-react"

export default function HomePage() {
  return <Layout><Home /></Layout>
}

function Home() {
  return (
    <AppPageTemplate
      eyebrow="Dashboard"
      title="Control the pulse of your music ecosystem."
      description="Track the weekly competition, monitor audience momentum, and jump into the areas that keep creators and listeners moving across Profynus."
      actions={[
        { label: "Open feed", href: "/feed" },
        { label: "View history", href: "/history", variant: "secondary" },
      ]}
      stats={[
        { label: "Streams today", value: "18.4K", change: "+12%" },
        { label: "Artists active", value: "342", change: "+29" },
        { label: "Playlist saves", value: "2.1K", change: "+8%" },
        { label: "Competition entries", value: "96", change: "Week 11" },
      ]}
      aside={<HomeAside />}
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <TemplateCard
          title="This week at a glance"
          description="A quick operating view of the features that drive Profynus: streaming, uploads, social engagement, and the weekly leaderboard."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {overviewCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-cyan-950/70 bg-slate-950/80 p-4">
                <div className="mb-4 inline-flex rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                  <card.icon size={20} />
                </div>
                <p className="text-base font-semibold text-white">{card.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{card.description}</p>
              </div>
            ))}
          </div>
        </TemplateCard>

        <TemplateCard
          title="Quick launch"
          description="Move into the next workflow without losing context."
        >
          <div className="space-y-3">
            {quickLaunchLinks.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="flex items-center justify-between rounded-2xl border border-cyan-950/70 bg-slate-950/80 px-4 py-3 transition hover:border-cyan-700/35 hover:bg-cyan-950/25"
              >
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.26em] text-cyan-300">Open</span>
              </Link>
            ))}
          </div>
        </TemplateCard>
      </div>

      <TemplateCard
        title="Platform highlights"
        description="The current experience is built around uploads, the public feed, weekly competition, flexible playback, and secure identity management."
      >
        <TemplateList items={highlights} />
      </TemplateCard>
    </AppPageTemplate>
  )
}

function HomeAside() {
  return (
    <>
      <TemplateCard title="Leaderboard watch" description="The weekly competition resets every Monday and rewards engagement across the public feed.">
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between rounded-2xl border border-cyan-950/70 bg-slate-950/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-300">
                  0{index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{entry.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{entry.genre}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-cyan-300">{entry.score}</p>
            </div>
          ))}
        </div>
      </TemplateCard>

      <TemplateCard title="Release cadence" description="Recommended publishing rhythm for creators who want stronger feed visibility.">
        <TemplateList items={cadence} />
      </TemplateCard>
    </>
  )
}

const overviewCards = [
  {
    title: "Upload and share",
    description: "Publish tracks with metadata and place them directly in front of listeners on the public feed.",
    icon: Disc3,
  },
  {
    title: "Social feed",
    description: "Stream music, react to releases, follow creators, and distribute standout songs across social channels.",
    icon: Radio,
  },
  {
    title: "Weekly competition",
    description: "Every reaction contributes to the leaderboard, pushing the best performing tracks into the winner playlist.",
    icon: Trophy,
  },
  {
    title: "Retention flow",
    description: "Keep listeners close with playlists, downloads, and secure session-backed accounts.",
    icon: Flame,
  },
]

const quickLaunchLinks = [
  {
    title: "Feed command center",
    description: "Review new uploads and engagement-ready posts.",
    href: "/feed",
  },
  {
    title: "Friends network",
    description: "See shared tastes, requests, and listening circles.",
    href: "/friends",
  },
  {
    title: "Account studio",
    description: "Manage identity, profile completeness, and security.",
    href: "/profile",
  },
]

const highlights = [
  {
    title: "Music upload and sharing",
    description: "Artists can publish a track, add title, genre, and description, then push it to the public listening surface.",
    meta: "Creators",
  },
  {
    title: "Social feed engagement",
    description: "Listeners stream, react, follow artists, and share tracks while discovery stays active and visible.",
    meta: "Community",
  },
  {
    title: "Competition engine",
    description: "Reactions accumulate weekly, top performers are selected automatically, and winners move to a featured playlist.",
    meta: "Weekly",
  },
  {
    title: "Streaming and downloads",
    description: "Users can listen in-browser, save public tracks for offline use, and keep playlists organized.",
    meta: "Playback",
  },
  {
    title: "Authentication and protection",
    description: "Registration, login, session persistence, and protected routes secure the application flow.",
    meta: "Security",
  },
]

const leaderboard = [
  { name: "Nova Kairo", genre: "Synthwave", score: "9.8K reacts" },
  { name: "Cielo Drift", genre: "Alt Pop", score: "8.9K reacts" },
  { name: "Bassline Ritual", genre: "Afro House", score: "8.2K reacts" },
]

const cadence = [
  {
    title: "Monday drop window",
    description: "Launch early in the competition cycle to maximize total reaction time.",
    meta: "Best",
  },
  {
    title: "Midweek audience check",
    description: "Use the feed and friends activity to spot tracks with breakout momentum.",
    meta: "Insight",
  },
  {
    title: "Weekend playlist push",
    description: "Convert strong songs into saves and repeat listening with playlist placements.",
    meta: "Growth",
  },
]

