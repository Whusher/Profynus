import Layout from "@components/layout/Layout"
import AppPageTemplate, {
  TemplateCard,
  TemplateList,
} from "@components/layout/AppPageTemplate"

export default function FeedPage() {
  return <Layout><FeedContent /></Layout>
}

function FeedContent() {
  return (
    <AppPageTemplate
      eyebrow="Feed"
      title="A publishing and discovery feed built for momentum."
      description="Use the social feed as the main stage for uploads, reactions, follows, and share-ready releases. This template models the flow between creators launching tracks and listeners amplifying them."
      actions={[
        { label: "Return home", href: "/home", variant: "secondary" },
        { label: "Open friends", href: "/friends" },
      ]}
      stats={[
        { label: "New uploads", value: "47", change: "Last 24h" },
        { label: "Total reactions", value: "31K", change: "+18%" },
        { label: "Shares sent", value: "4.2K", change: "+9%" },
        { label: "Artists followed", value: "1.4K", change: "+112" },
      ]}
      aside={<FeedAside />}
    >
      <TemplateCard title="Feed modules" description="This page structure supports the end-to-end public feed experience described in the product definition.">
        <TemplateList items={feedModules} />
      </TemplateCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <TemplateCard title="Featured upload rail" description="A hero strip for standout tracks, editor picks, or sponsored releases.">
          <div className="space-y-3">
            {featuredUploads.map((item) => (
              <div key={item.title} className="rounded-2xl border border-cyan-950/70 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.artist}</p>
                  </div>
                  <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-300">
                    {item.badge}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </TemplateCard>

        <TemplateCard title="Engagement mechanics" description="The feed design should make the main actions impossible to miss.">
          <div className="grid gap-3 sm:grid-cols-2">
            {engagementTools.map((item) => (
              <div key={item.title} className="rounded-2xl border border-cyan-950/70 bg-slate-950/80 p-4">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </TemplateCard>
      </div>
    </AppPageTemplate>
  )
}

function FeedAside() {
  return (
    <>
      <TemplateCard title="Trending genres" description="Quick discovery pivots for listeners browsing what is moving now.">
        <TemplateList items={genrePulse} />
      </TemplateCard>

      <TemplateCard title="Share cadence" description="Distribution touchpoints that keep good tracks circulating outside the product.">
        <TemplateList items={shareCadence} />
      </TemplateCard>
    </>
  )
}

const feedModules = [
  {
    title: "Upload composer",
    description: "A top-level entry for artists to add a title, genre, description, cover, and release a new track into the feed.",
    meta: "Create",
  },
  {
    title: "Live stream cards",
    description: "Each card should support instant play, lightweight metadata, creator identity, and social reactions.",
    meta: "Play",
  },
  {
    title: "Follow and reaction loop",
    description: "Listeners follow creators, like tracks, save favorites, and help songs climb the weekly competition.",
    meta: "React",
  },
  {
    title: "Share-out layer",
    description: "Strong songs can be pushed to social platforms to pull attention back into the public feed.",
    meta: "Share",
  },
]

const featuredUploads = [
  {
    title: "Midnight Runway",
    artist: "By Neon Harbour",
    badge: "Winner watch",
    description: "A cinematic synth record with the strongest share velocity in the last 6 hours.",
  },
  {
    title: "Tropic Voltage",
    artist: "By Kora Lane",
    badge: "Fresh drop",
    description: "A high-energy afro-electronic single positioned for playlist saves and repeat streams.",
  },
]

const engagementTools = [
  {
    title: "Inline reactions",
    description: "Likes, favorites, and applause patterns should be visible without opening a detail page.",
  },
  {
    title: "Follow states",
    description: "Listener relationships with artists need persistent, low-friction follow actions.",
  },
  {
    title: "Share prompts",
    description: "The feed should surface short prompts when a song is trending enough to be shared externally.",
  },
  {
    title: "Competition tags",
    description: "Track cards can indicate whether a release is climbing, holding, or falling in the current week.",
  },
]

const genrePulse = [
  { title: "Alt Pop", description: "Fastest share growth across public releases.", meta: "Hot" },
  { title: "Amapiano", description: "Highest replay rate among returning listeners.", meta: "Loop" },
  { title: "Synthwave", description: "Strong weekly leaderboard presence.", meta: "Rise" },
]

const shareCadence = [
  { title: "Launch post", description: "Pair each upload with a ready-made social snippet.", meta: "T+0" },
  { title: "Peak check", description: "Re-share when reactions accelerate above baseline.", meta: "T+6h" },
  { title: "Playlist push", description: "Convert attention into saves at the weekend peak.", meta: "T+3d" },
]