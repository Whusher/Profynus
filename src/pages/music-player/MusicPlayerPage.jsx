import Layout from "@components/layout/Layout"
import AppPageTemplate, {
  TemplateCard,
  TemplateList,
} from "@components/layout/AppPageTemplate"
import MusicPlayerSample from "@components/music/MusicPlayerSample"
import SEO from "@/services/SEO"

export default function MusicPlayerPage() {
  return <Layout><MusicPlayerContent /></Layout>
}

function MusicPlayerContent() {
  return (
    <AppPageTemplate
      eyebrow="Music Player"
      title="ThreeJS sample player integrated into Profynus."
      description="This is a working sample using your provided audio URL, reactive 3D visuals, and core controls so you can iterate toward the final player experience without rebuilding routing or shell structure."
      actions={[
        { label: "Open feed", href: "/feed", variant: "secondary" },
        { label: "Back home", href: "/home" },
      ]}
      stats={[
        { label: "Sample mode", value: "Live", change: "ThreeJS" },
        { label: "Audio source", value: "Remote", change: "GOMD.mp3" },
        { label: "Visualizer", value: "Reactive", change: "FFT data" },
        { label: "Controls", value: "Ready", change: "Core set" },
      ]}
      aside={<PlayerAside />}
    >
      <TemplateCard
        title="Player sample"
        description="Includes play/pause, seek, skip, loop, volume, download, and 3D audio-reactive scene."
      >
        <MusicPlayerSample />
      </TemplateCard>
      <SEO
        title={'Music Experience'}
        image="/assets/logo-square-wp-8cYfY.png"
        description="Music player available for everyone"
      />
    </AppPageTemplate>
  )
}

function PlayerAside() {
  return (
    <>
      <TemplateCard title="Integration notes" description="How this sample is wired inside Profynus.">
        <TemplateList
          items={[
            {
              title: "Route ready",
              description: "Player runs on /moremusic and keeps the shared app shell.",
              meta: "Navigation",
            },
            {
              title: "ThreeJS stack",
              description: "Uses three + @react-three/fiber + @react-three/drei.",
              meta: "3D",
            },
            {
              title: "Analyser pipeline",
              description: "AudioContext FFT data drives the wave surface and frequency ring.",
              meta: "Audio",
            },
          ]}
        />
      </TemplateCard>

      <TemplateCard title="Next upgrades" description="Recommended production iterations.">
        <TemplateList
          items={[
            {
              title: "Playlist source",
              description: "Swap static URL for feed-driven tracks with queue state.",
              meta: "Data",
            },
            {
              title: "Behavioral metrics",
              description: "Send play, pause, completion, and seek events to your API.",
              meta: "Analytics",
            },
            {
              title: "Fallback UX",
              description: "Show a graceful mode if CORS blocks analyzer or download.",
              meta: "Reliability",
            },
          ]}
        />
      </TemplateCard>
    </>
  )
}