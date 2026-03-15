import { motion } from "framer-motion"
import { Link } from "react-router"
import { ArrowRight } from "lucide-react"

export default function AppPageTemplate({
  eyebrow,
  title,
  description,
  actions = [],
  stats = [],
  aside,
  children,
}) {
  return (
    <section className="relative isolate w-full overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-cyan-900/18 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-700/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-size-[30px_30px] mask-[radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:max-w-[88rem] 2xl:max-w-[96rem]">
        <motion.div
          className="overflow-hidden rounded-[28px] border border-[color:var(--prof-border)] bg-linear-to-br from-[var(--prof-bg-base)] via-[var(--prof-bg-elevated)] to-cyan-950/30 p-6 shadow-[0_0_80px_rgba(6,182,212,0.08)] backdrop-blur-xl sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex rounded-full border border-[color:var(--prof-border-strong)] bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
                {eyebrow}
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[var(--prof-text-muted)] sm:text-base">
                  {description}
                </p>
              </div>

              {actions.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {actions.map((action) => (
                    <ActionLink key={action.label} {...action} />
                  ))}
                </div>
              )}
            </div>

            {stats.length > 0 && (
              <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">{children}</div>
          {aside ? <aside className="space-y-6">{aside}</aside> : null}
        </div>
      </div>
    </section>
  )
}

export function TemplateCard({ title, description, action, children, className = "" }) {
  return (
    <section
      className={`rounded-3xl border border-[color:var(--prof-border)] bg-linear-to-b from-[var(--prof-bg-elevated)] via-[var(--prof-bg-base)] to-[var(--prof-bg-base)] p-5 shadow-[0_18px_50px_var(--prof-shadow-strong)] backdrop-blur ${className}`.trim()}
    >
      {(title || description || action) && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {title ? <h2 className="text-lg font-semibold text-white">{title}</h2> : null}
            {description ? <p className="text-sm leading-6 text-[var(--prof-text-muted)]">{description}</p> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  )
}

export function TemplateList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="flex items-start justify-between gap-4 rounded-2xl border border-[color:var(--prof-border)] bg-[var(--prof-bg-panel-soft)] px-4 py-3"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">{item.title}</p>
            <p className="text-sm text-[var(--prof-text-muted)]">{item.description}</p>
          </div>
          {item.meta ? <span className="text-xs uppercase tracking-[0.24em] text-cyan-300">{item.meta}</span> : null}
        </div>
      ))}
    </div>
  )
}

export function TemplateEmptyCanvas({ title, description }) {
  return (
    <div className="flex min-h-115 items-center justify-center rounded-[28px] border border-dashed border-[color:var(--prof-border)] bg-[var(--prof-bg-panel)] p-8 text-center">
      <div className="max-w-md space-y-3">
        <p className="text-xl font-semibold text-white">{title}</p>
        <p className="text-sm leading-7 text-[var(--prof-text-muted)]">{description}</p>
      </div>
    </div>
  )
}

function ActionLink({ label, href, variant = "primary" }) {
  const baseClassName =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300"

  const variantClassName =
    variant === "secondary"
      ? "border border-[color:var(--prof-border)] bg-[var(--prof-bg-panel)] text-white hover:border-[color:var(--prof-border-strong)] hover:bg-[var(--prof-bg-chip)]"
      : "border border-cyan-300/30 bg-cyan-400 text-slate-950 hover:bg-cyan-300"

  return (
    <Link to={href} className={`${baseClassName} ${variantClassName}`}>
      {label}
      <ArrowRight size={16} />
    </Link>
  )
}

function StatCard({ label, value, change }) {
  return (
    <div className="rounded-2xl border border-[color:var(--prof-border)] bg-[var(--prof-bg-panel)] p-4">
      <p className="text-xs uppercase tracking-[0.28em] text-[var(--prof-text-muted)]">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold text-white">{value}</p>
        {change ? <p className="text-xs font-medium text-cyan-300">{change}</p> : null}
      </div>
    </div>
  )
}