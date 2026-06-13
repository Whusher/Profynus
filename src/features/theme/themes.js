export const DEFAULT_THEME = "cyan"

export const THEME_OPTIONS = [
  {
    value: "cyan",
    label: "Cyan",
    description: "Default Profynus look",
    preview: "#22d3ee",
  },
  {
    value: "purple",
    label: "Purple",
    description: "Neo-luxury with a deeper glow",
    preview: "#c084fc",
  },
  {
    value: "rose",
    label: "Rose",
    description: "Warm, punchy, and energetic",
    preview: "#fb7185",
  },
  {
    value: "amber",
    label: "Amber",
    description: "High-contrast studio warmth",
    preview: "#fbbf24",
  },
  {
    value: "emerald",
    label: "Emerald",
    description: "Calm and focused",
    preview: "#34d399",
  },
]

export const THEME_VALUES = THEME_OPTIONS.map((theme) => theme.value)

export const isThemeValue = (value) => THEME_VALUES.includes(value)