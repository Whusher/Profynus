import Layout from "@components/layout/Layout"
import AppPageTemplate, {
  TemplateCard,
  TemplateList,
} from "@components/layout/AppPageTemplate"
import { useAuthStore } from "@store/index"

export default function AccountPage() {
  return <Layout><AccountContent /></Layout>
}

function AccountContent() {
  const user = useAuthStore((state) => state.user)
  const displayName = user?.name || user?.username || user?.email || "Your profile"

  return (
    <AppPageTemplate
      eyebrow="Account"
      title={`Manage ${displayName} with a secure, creator-first workspace.`}
      description="The account area should give users control over profile data, security, sessions, and the public identity that appears across uploads, feed cards, and social discovery."
      actions={[
        { label: "View history", href: "/history", variant: "secondary" },
        { label: "See friends", href: "/friends" },
      ]}
      stats={[
        { label: "Profile completion", value: "78%", change: "Add socials" },
        { label: "Sessions active", value: "2", change: "Protected" },
        { label: "Saved playlists", value: "14", change: "+2" },
        { label: "Followers", value: "3.8K", change: "+184" },
      ]}
      aside={<AccountAside />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <TemplateCard title="Identity management" description="User-facing information that should remain clear, editable, and trustworthy.">
          <TemplateList items={identityModules} />
        </TemplateCard>

        <TemplateCard title="Security controls" description="Authentication and protected routes are core product features, so the account template needs visible security tooling.">
          <TemplateList items={securityModules} />
        </TemplateCard>
      </div>

      <TemplateCard title="Creator profile presentation" description="A polished account page should help artists convert profile visits into streams, follows, and playlist saves.">
        <div className="grid gap-3 md:grid-cols-3">
          {creatorPanels.map((item) => (
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

function AccountAside() {
  return (
    <>
      <TemplateCard title="Completion guide" description="A simple checklist for improving trust and discovery.">
        <TemplateList items={completionGuide} />
      </TemplateCard>

      <TemplateCard title="Session posture" description="Useful context when a user needs confidence in account safety.">
        <TemplateList items={sessionPosture} />
      </TemplateCard>
    </>
  )
}

const identityModules = [
  { title: "Public profile", description: "Display name, username, biography, artist role, and genre focus.", meta: "Visible" },
  { title: "Avatar and artwork", description: "A consistent visual identity across uploads, comments, and social surfaces.", meta: "Media" },
  { title: "Social and website links", description: "Bridge traffic between Profynus and the artist's wider ecosystem.", meta: "Reach" },
]

const securityModules = [
  { title: "Session persistence", description: "Allow reliable logins while keeping the current session transparent to the user.", meta: "Core" },
  { title: "Password updates", description: "Critical account operations should be easy to reach and clearly explained.", meta: "Auth" },
  { title: "Protected route awareness", description: "Users should understand which areas depend on being authenticated.", meta: "Access" },
]

const creatorPanels = [
  {
    title: "Pinned release",
    description: "Keep the most important song or project at the top of the profile narrative.",
  },
  {
    title: "Audience proof",
    description: "Highlight followers, saves, and recent reaction growth without clutter.",
  },
  {
    title: "Playlist spotlight",
    description: "Promote the collections most likely to deepen listening time.",
  },
]

const completionGuide = [
  { title: "Upload a cover image", description: "Improve recognition across the feed and friends pages.", meta: "Pending" },
  { title: "Add your top genres", description: "Make discovery and recommendations more accurate.", meta: "Helpful" },
  { title: "Link socials", description: "Enable stronger off-platform music sharing.", meta: "Growth" },
]

const sessionPosture = [
  { title: "Primary device", description: "Windows desktop session remains active.", meta: "Current" },
  { title: "Last secure sign in", description: "Protected route access confirmed earlier today.", meta: "Verified" },
  { title: "Recovery readiness", description: "Backup email and password reset flow should stay accessible.", meta: "Safe" },
]