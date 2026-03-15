import Header from "./Header"
import Footer from "./Footer"

export default function Layout({children}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-950 text-white">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
