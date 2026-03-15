import Layout from "@components/layout/Layout"
import AppPageTemplate, {
  TemplateCard,
  TemplateList,
} from "@components/layout/AppPageTemplate"

export default function HistoryPage() {
  return <Layout><HistoryContent /></Layout>
}

function HistoryContent() {
  return (
    <AppPageTemplate
      eyebrow="History"
      title="Give listening and download history a useful narrative."
      description="History should help users return to tracks, understand their habits, and recover past downloads or playlists without searching the whole platform again."
      actions={[
        { label: "Go home", href: "/home", variant: "secondary" },
        { label: "Open feed", href: "/feed" },
      ]}
      stats={[
        { label: "Tracks played", value: "1,284", change: "30 days" },
        { label: "Downloads", value: "86", change: "+11" },
        { label: "Replay rate", value: "63%", change: "Stable" },
        { label: "Saved sessions", value: "18", change: "Recovered" },
      ]}
      aside={<HistoryAside />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <TemplateCard title="History streams" description="The core historical views that matter for a music product.">
          <TemplateList items={historyStreams} />
        </TemplateCard>

        <TemplateCard title="User recovery actions" description="A strong history page removes friction when users want to return to something they already liked.">
          <TemplateList items={recoveryActions} />
        </TemplateCard>
      </div>

      <TemplateCard title="Behavioral snapshots" description="High-level signals help the user understand how they consume the platform over time.">
        <div className="grid gap-3 md:grid-cols-3">
          {snapshots.map((item) => (
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

function HistoryAside() {
  return (
    <>
      <TemplateCard title="Recent milestones" description="Moments worth surfacing without making the page feel analytical for the sake of it.">
        <TemplateList items={milestones} />
      </TemplateCard>

      <TemplateCard title="Return paths" description="Shortcuts back into listening modes that match earlier behavior.">
        <TemplateList items={returnPaths} />
      </TemplateCard>
    </>
  )
}

const historyStreams = [
  { title: "Listening history", description: "Chronological playback of streamed tracks with artist and playlist context.", meta: "Stream" },
  { title: "Download history", description: "A record of tracks saved for offline access from public repositories.", meta: "Offline" },
  { title: "Playlist edits", description: "Changes to personal collections so users can recover an earlier structure.", meta: "Organize" },
]

const recoveryActions = [
  { title: "Resume last session", description: "Continue from the most recent listening path without rebuilding context.", meta: "Fast" },
  { title: "Re-add to playlist", description: "Move previously played songs back into active playlists quickly.", meta: "Useful" },
  { title: "Replay trend", description: "Surface tracks with strong personal replay behavior.", meta: "Signal" },
]

const snapshots = [
  {
    title: "Peak listening window",
    description: "Late-night sessions drive most of your total streams and playlist saves.",
  },
  {
    title: "Favorite source",
    description: "Most repeats start from the public feed rather than direct search.",
  },
  {
    title: "Top mode",
    description: "Download-to-playback usage grows when a track is already saved into a playlist.",
  },
]

const milestones = [
  { title: "100th stream this week", description: "A strong engagement streak is active.", meta: "New" },
  { title: "14 playlists touched", description: "Collection management is trending upward.", meta: "Organized" },
  { title: "3 artists revisited", description: "Returning behavior is concentrated on familiar creators.", meta: "Repeat" },
]

const returnPaths = [
  { title: "Resume downloads", description: "Jump back into tracks previously saved for offline use.", meta: "Offline" },
  { title: "Reopen favorites", description: "Continue from the songs with the highest personal reaction rate.", meta: "Liked" },
  { title: "Recent competition songs", description: "Return to entries you followed during the weekly leaderboard cycle.", meta: "Weekly" },
]