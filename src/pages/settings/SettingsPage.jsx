import { useMemo } from "react"
import { Check, MonitorCog, MoonStar, RotateCcw, SlidersHorizontal, Sparkles, Smartphone, Volume2 } from "lucide-react"
import Layout from "@components/layout/Layout"
import AppPageTemplate, { TemplateCard, TemplateList } from "@components/layout/AppPageTemplate"
import { THEME_OPTIONS } from "@features/theme/themes"
import { useSettingsStore, useThemeStore } from "@store/index"

export default function SettingsPage() {
  return <Layout><SettingsContent /></Layout>
}

function SettingsContent() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const reducedMotion = useSettingsStore((state) => state.reducedMotion)
  const compactLayout = useSettingsStore((state) => state.compactLayout)
  const playbackHints = useSettingsStore((state) => state.playbackHints)
  const queueAutofocus = useSettingsStore((state) => state.queueAutofocus)
  const setReducedMotion = useSettingsStore((state) => state.setReducedMotion)
  const setCompactLayout = useSettingsStore((state) => state.setCompactLayout)
  const setPlaybackHints = useSettingsStore((state) => state.setPlaybackHints)
  const setQueueAutofocus = useSettingsStore((state) => state.setQueueAutofocus)
  const resetSettings = useSettingsStore((state) => state.resetSettings)

  const activeTheme = useMemo(
    () => THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[0],
    [theme]
  )

  return (
    <AppPageTemplate
      eyebrow="Settings"
      title="Shape the Profynus workspace around your listening style."
      description="Theme colors, motion, and playback preferences live here. This page keeps the top bar clean while giving users a focused control center for the overall app feel."
      actions={[
        { label: "Back to home", href: "/home", variant: "secondary" },
        { label: "Open player", href: "/moremusic" },
      ]}
      stats={[
        { label: "Active theme", value: activeTheme.label, change: "Accent" },
        { label: "Motion", value: reducedMotion ? "Reduced" : "Full", change: reducedMotion ? "Calm" : "Animated" },
        { label: "Layout", value: compactLayout ? "Compact" : "Roomy", change: "Spacing" },
        { label: "Playback hints", value: playbackHints ? "On" : "Off", change: queueAutofocus ? "Queue focus" : "Manual" },
      ]}
      aside={<SettingsAside />}
    >
      <TemplateCard title="Theme palette" description="Pick the accent language that best fits the rest of the shell.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {THEME_OPTIONS.map((option) => {
            const isActive = theme === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={[
                  "flex items-center gap-3 rounded-3xl border px-4 py-4 text-left transition",
                  isActive
                    ? "border-(--prof-border-strong) bg-(--prof-bg-chip) text-white shadow-[0_18px_40px_var(--prof-shadow-soft)]"
                    : "border-(--prof-border) bg-(--prof-bg-panel) text-slate-300 hover:border-(--prof-border-strong) hover:bg-(--prof-bg-chip) hover:text-white",
                ].join(" ")}
              >
                <span
                  className="h-11 w-11 rounded-2xl border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.25)]"
                  style={{ backgroundColor: option.preview }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {option.label}
                    {isActive ? <Check size={16} className="text-(--prof-accent)" /> : null}
                  </span>
                  <span className="block truncate text-xs text-slate-400">{option.description}</span>
                </span>
              </button>
            )
          })}
        </div>
      </TemplateCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <TemplateCard title="Interface preferences" description="Small quality-of-life changes that affect how the shell feels day to day.">
          <div className="grid gap-3">
            <ToggleSetting
              icon={<MoonStar size={18} />}
              title="Reduce motion"
              description="Minimize transitions and animation for a calmer workspace."
              enabled={reducedMotion}
              onToggle={() => setReducedMotion(!reducedMotion)}
            />
            <ToggleSetting
              icon={<MonitorCog size={18} />}
              title="Compact layout"
              description="Reserve a tighter layout for denser browsing and more content above the fold."
              enabled={compactLayout}
              onToggle={() => setCompactLayout(!compactLayout)}
            />
            <ToggleSetting
              icon={<Sparkles size={18} />}
              title="Playback hints"
              description="Show contextual copy and quick prompts near the player."
              enabled={playbackHints}
              onToggle={() => setPlaybackHints(!playbackHints)}
            />
            <ToggleSetting
              icon={<Volume2 size={18} />}
              title="Queue autofocus"
              description="Keep the queue panel ready when the full player opens."
              enabled={queueAutofocus}
              onToggle={() => setQueueAutofocus(!queueAutofocus)}
            />
          </div>
        </TemplateCard>

        <TemplateCard title="Accessibility and control" description="Useful defaults for a workspace that should stay comfortable under long sessions.">
          <TemplateList items={accessibilityNotes} />
        </TemplateCard>
      </div>

      <TemplateCard
        title="Reset and session management"
        description="Use this area to return the app shell to its default state when experimenting with preferences."
        action={
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex items-center gap-2 rounded-full border border-(--prof-border) bg-(--prof-bg-panel) px-4 py-2 text-sm font-medium text-white transition hover:border-(--prof-border-strong) hover:bg-(--prof-bg-chip)"
          >
            <RotateCcw size={16} />
            Reset preferences
          </button>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          {resetCards.map((item) => (
            <div key={item.title} className="rounded-2xl border-(--prof-border) bg-(--prof-bg-panel) p-4">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </TemplateCard>
    </AppPageTemplate>
  )
}

function SettingsAside() {
  return (
    <>
      <TemplateCard title="Quick summary" description="What the current app shell will look and feel like.">
        <TemplateList items={summaryItems} />
      </TemplateCard>

      <TemplateCard title="Available scopes" description="The settings page is designed to grow beyond themes without crowding the header.">
        <TemplateList items={scopeItems} />
      </TemplateCard>
    </>
  )
}

function ToggleSetting({ icon, title, description, enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "flex items-start gap-4 rounded-3xl border p-4 text-left transition",
        enabled
          ? "border-(--prof-border-strong) bg-(--prof-bg-chip) text-white"
          : "border-(--prof-border) bg-(--prof-bg-panel) text-slate-300 hover:border-(--prof-border-strong) hover:bg-(--prof-bg-chip) hover:text-white",
      ].join(" ")}
    >
      <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-(--prof-accent-soft) text-(--prof-accent)" aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-white">{title}</span>
          <span className={enabled ? "text-xs font-medium text-(--prof-accent)" : "text-xs font-medium text-slate-500"}>
            {enabled ? "On" : "Off"}
          </span>
        </span>
        <span className="mt-1 block text-sm leading-6 text-slate-400">{description}</span>
      </span>
    </button>
  )
}

const accessibilityNotes = [
  { title: "Motion sensitivity", description: "Reduced motion trims high-frequency animation across the shell.", meta: "Live" },
  { title: "Color focus", description: "Accent themes help the UI read clearly without changing the layout.", meta: "Theme" },
  { title: "Workspace density", description: "Compact layout is stored so the shell can evolve into a denser mode later.", meta: "Saved" },
]

const summaryItems = [
  { title: "Theme manager", description: "Choose cyan, purple, rose, amber, or emerald from one page.", meta: "Ready" },
  { title: "Preferences", description: "Reduced motion and other shell settings stay persisted locally.", meta: "Persisted" },
  { title: "Future sections", description: "Notifications, playback defaults, and account controls can be added here.", meta: "Expandable" },
]

const scopeItems = [
  { title: "Appearance", description: "Themes, contrast, and motion preferences for the shell.", meta: "Now" },
  { title: "Playback", description: "Player defaults and queue behavior can live here next.", meta: "Next" },
  { title: "Account", description: "Security and profile actions can be grouped into a dedicated section.", meta: "Later" },
]

const resetCards = [
  { title: "Theme selection", description: "Reset the accent back to cyan when experimenting with palettes." },
  { title: "Preference flags", description: "Return reduced motion and playback defaults to the standard shell state." },
  { title: "Local storage", description: "The stored settings entry stays scoped to the browser profile on this device." },
]