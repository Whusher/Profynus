import Header from "./Header"
import Footer from "./Footer"

export default function Layout({children}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[var(--prof-bg-base)] text-[var(--prof-text-primary)]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-black via-black to-cyan-950/35" />
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-900/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-700/10 blur-3xl" />
      </div>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer variant="app" />
    </div>
  )
}
