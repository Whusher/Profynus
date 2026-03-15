import Layout from "@components/layout/Layout"
import AppPageTemplate, {
  TemplateCard,
  TemplateEmptyCanvas,
} from "@components/layout/AppPageTemplate"

export default function MusicPlayerPage() {
  return <Layout><MusicPlayerContent /></Layout>
}

function MusicPlayerContent() {
  return (
    <AppPageTemplate
      eyebrow="Music Player"
      title="Reserved canvas for the player experience."
      description="This route is intentionally left open so the dedicated music player can be designed and implemented separately without forcing a temporary UI into production."
      stats={[
        { label: "Status", value: "Blank", change: "Reserved" },
        { label: "Layout", value: "Ready", change: "Shell only" },
        { label: "Theme", value: "Cyan/Black", change: "Aligned" },
        { label: "Next owner", value: "Player", change: "Pending" },
      ]}
    >
      <TemplateCard>
        <TemplateEmptyCanvas
          title="Music player page intentionally left blank"
          description="The navigation route and visual shell are in place. The playback interface can be added here later without changing the app structure again."
        />
      </TemplateCard>
    </AppPageTemplate>
  )
}