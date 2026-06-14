import { useMemo, useState } from "react"
import Layout from "@components/layout/Layout"
import { motion } from "framer-motion"
import { TemplateCard, TemplateList } from "@components/layout/AppPageTemplate"
import musicService from "@/api/services/musicService"
import { AlertTriangle, CheckCircle2, Disc3, Download, LoaderCircle, Link2, ChartNoAxesCombined } from "lucide-react"

export default function HomePage() {
  return <Layout><Home /></Layout>
}

function Home() {
  const [ytLink, setYtLink] = useState("")
  const [status, setStatus] = useState("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [progress, setProgress] = useState(0)
  const [downloadResult, setDownloadResult] = useState(null)

  const statusText = useMemo(() => {
    if (status === "validating") return "Validating YouTube link..."
    if (status === "requesting") return "Sending download request..."
    if (status === "processing") return "Preparing track data..."
    if (status === "ready") return "Your track is ready to download."
    if (status === "error") return "Request failed."
    return "Paste a YouTube link to begin."
  }, [status])

  const isBusy = status === "validating" || status === "requesting" || status === "processing"
  const requestedUrl = ytLink.trim()

  const isYouTubeUrl = (rawValue) => {
    try {
      const parsed = new URL(rawValue.trim())
      return ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"].includes(parsed.hostname)
    } catch {
      return false
    }
  }

  const wait = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

  const parseMetadata = (metadata) => {
    if (typeof metadata !== "string") return metadata || null

    try {
      return JSON.parse(metadata)
    } catch {
      return null
    }
  }

  const formatFileSize = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "Unknown size"

    const units = ["B", "KB", "MB", "GB", "TB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex += 1
    }

    const decimals = unitIndex === 0 || size >= 10 ? 0 : 2
    return `${size.toFixed(decimals)} ${units[unitIndex]}`
  }

  const formatDuration = (seconds) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "Unknown duration"

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = String(seconds % 60).padStart(2, "0")
    return `${minutes}:${remainingSeconds}`
  }

  const sanitizeFileName = (value) => value
    .replace(/[<>:"/\\|?*]/g, "-")
    .split("")
    .filter((character) => character.charCodeAt(0) >= 32)
    .join("")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "")

  const normalizeDownloadResult = (response, sourceUrl) => {
    const metadata = parseMetadata(response?.metadata)
    const resolvedUrl = response?.songPublicPath
      || metadata?.SongPublicPath
      || metadata?.songPublicPath
      || response?.SongPublicPath
      || ""

    const songName = response?.songName || metadata?.Title || "Untitled track"
    const artistName = response?.artistName || metadata?.Author || "Unknown artist"
    const fileFormat = String(response?.fileFormat || metadata?.FileFormat || "mp3").replace(/^\./, "")

    return {
      id: response?.id || metadata?.VideoId || `REQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      songName,
      artistName,
      albumName: response?.albumName || metadata?.Title || songName,
      genre: response?.genre || "Unknown",
      releaseYear: response?.releaseYear || null,
      durationSeconds: response?.durationSeconds || null,
      language: response?.language || "",
      sourceProvider: response?.sourceProvider || "youtube",
      sourceId: response?.sourceId || metadata?.VideoId || "",
      fileFormat,
      fileSizeBytes: response?.fileSizeBytes || null,
      songPublicPath: resolvedUrl,
      sourceUrl: metadata?.SourceUrl || sourceUrl,
      thumbnailUrl: metadata?.ThumbnailPublicPath || "",
      readyAt: response?.updatedAt || response?.createdAt || metadata?.SavedAt || new Date().toISOString(),
      downloadFileName: sanitizeFileName(`${artistName} - ${songName}.${fileFormat}`),
    }
  }

  const handleRequestSubmit = async (event) => {
    event.preventDefault()

    setErrorMessage("")
    setDownloadResult(null)
    setProgress(0)

    setStatus("validating")
    setProgress(15)
    await wait(450)

    if (!isYouTubeUrl(requestedUrl)) {
      setStatus("error")
      setErrorMessage("Please provide a valid YouTube URL (youtube.com or youtu.be).")
      return
    }

    setStatus("requesting")
    setProgress(42)

    try {
      const response = await musicService.downloadYTSong({ url: requestedUrl })

      setStatus("processing")
      setProgress(78)
      await wait(250)

      const normalizedResult = normalizeDownloadResult(response, requestedUrl)

      if (!normalizedResult.songPublicPath) {
        throw new Error("The server did not return a downloadable track URL.")
      }

      setDownloadResult(normalizedResult)
      setProgress(100)
      setStatus("ready")
    } catch (requestError) {
      setStatus("error")
      setProgress(0)
      setErrorMessage(requestError?.userMessage || requestError?.message || "Unable to download the track. Please try again.")
    }
  }

  const triggerTrackDownload = () => {
    if (!downloadResult) return

    const link = document.createElement("a")
    link.href = downloadResult.songPublicPath
    link.download = downloadResult.downloadFileName
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetFlow = () => {
    setStatus("idle")
    setProgress(0)
    setErrorMessage("")
    setDownloadResult(null)
    setYtLink("")
  }

  return (
    <div className="w-full p-2 grid gap-2 xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]">

      <motion.div 
        className="p-4 m-2 overflow-hidden rounded-[28px] border-(--prof-border) bg-linear-to-br from-(--prof-bg-base) via-(--prof-bg-elevated) to(--prof-theme-halo-1) backdrop-blur-xl "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1
          style={{ fontFamily: 'Audiowide, sans-serif' }}  
          className="font-semibold tracking-tight text-(--prof-accent) text-lg sm:text-xl lg:text-3xl flex items-center space-x-3">
          Download your first song
          <span className="mx-2">
            <Disc3/>
          </span>
        </h1>
        <p className="mt-3 text-sm text-(--prof-text-muted) sm:text-base">
          Paste a YouTube link and Profynus will fetch the track metadata, prepare the file, and give you the actual download button.
        </p>
        {/* Download request */}
        <form onSubmit={handleRequestSubmit} className="mt-5 rounded-2xl border-(--prof-border) bg-(--prof-bg-panel-soft) p-4 flex flex-col gap-4">
          <div 
            id="yt-link-block"
            className="w-full"
          >
            <p className="text-md md:text-lg my-1 flex items-center gap-2">
              <Link2 size={16} />
              Insert your YouTube link below
            </p>
            <input 
              type="text"
              id="yt-link"
              value={ytLink}
              onChange={(event) => setYtLink(event.target.value)}
              className="border-2 border-(--prof-accent-shadow) rounded-lg w-full md:w-3/4 focus:border-(--prof-accent) bg-(--prof-bg-base) font-light p-2 outline-none"
              placeholder="http://youtube.com/...."
            />
          </div>
          
          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex w-fit items-center gap-2 rounded-full border-(--prof-border-strong) bg-(--prof-accent) px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-(--prof-accent-strong) disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isBusy ? <LoaderCircle size={16} className="animate-spin" /> : <Download size={16} />}
            <span
              style={{ fontFamily: 'Audiowide, sans-serif' }}  
            >
              {isBusy ? "Processing..." : "Download song"}
            </span>
          </button>

          <div className="space-y-2">
            <p className="text-sm text-(--prof-accent)">{statusText}</p>
            {(isBusy || status === "ready") && (
              <div className="h-2 overflow-hidden rounded-full bg-(--prof-bg-chip)">
                <div className="h-full rounded-full bg-(--prof-accent) transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>

          {status === "error" && (
            <div className="flex items-start gap-2 rounded-xl border border-(--prof-danger-border) bg-(--prof-danger-bg) px-3 py-2 text-sm text-red-200">
              <AlertTriangle size={16} className="mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          {status === "ready" && downloadResult && (
            <div className="rounded-2xl border-(--prof-border-strong) bg-(--prof-bg-chip) p-4 text-sm">
              <p className="flex items-center gap-2 font-semibold text-emerald-300">
                <CheckCircle2 size={16} />
                Track ready for download
              </p>
              <div className="mt-3 grid gap-2 text-(--prof-text-muted) sm:grid-cols-2">
                <p><span className="text-white">Song:</span> {downloadResult.songName}</p>
                <p><span className="text-white">Artist:</span> {downloadResult.artistName}</p>
                <p><span className="text-white">Format:</span> {downloadResult.fileFormat.toUpperCase()}</p>
                <p><span className="text-white">Size:</span> {formatFileSize(downloadResult.fileSizeBytes)}</p>
                <p><span className="text-white">Duration:</span> {formatDuration(downloadResult.durationSeconds)}</p>
                <p><span className="text-white">Released:</span> {downloadResult.releaseYear || "Unknown"}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={triggerTrackDownload}
                  className="rounded-full border-(--prof-border-strong) bg-(--prof-accent) px-4 py-2 font-medium text-slate-950 transition hover:bg-(--prof-accent-strong)"
                >
                  Download actual track
                </button>
                <button
                  type="button"
                  onClick={resetFlow}
                  className="rounded-full border-(--prof-border) bg-(--prof-bg-panel) px-4 py-2 font-medium text-white transition hover:bg-(--prof-bg-chip-hover)"
                >
                  New request
                </button>
              </div>
              <p className="mt-3 break-all text-xs text-(--prof-text-muted)">
                Download URL: {downloadResult.songPublicPath}
              </p>
            </div>
          )}

        </form>
        
        {/* Music user library quick access */}
        
        <div className="m-4">
          <p className="text-(--prof-text-muted) text-sm mt-4 flex justify-between space-x-1.5">
            Listen any of the new songs added 
            <ChartNoAxesCombined/>
          </p>
          
          {/* Include music cards */}
          <TemplateCard
            title="Recent downloads"
            description="Give a try to listen the flow of other people, it could be great!"
          >
            {/* Scrolleable library with play action */}
            
          </TemplateCard>
        </div>
      
      </motion.div>

      
      <aside className="m-3 xl:m-0 xl:mt-4 space-y-6">
        <HomeAside />
      </aside>

    </div>
  )
}


function HomeAside() {
  return (
    <>
      <TemplateCard title="Leaderboard watch" description="The weekly competition resets every Monday and rewards engagement across the public feed.">
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between rounded-2xl border border-cyan-950/70 bg-slate-950/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-300">
                  0{index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{entry.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{entry.genre}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-cyan-300">{entry.score}</p>
            </div>
          ))}
        </div>
      </TemplateCard>

      <TemplateCard title="Release cadence" description="Recommended publishing rhythm for creators who want stronger feed visibility.">
        <TemplateList items={cadence} />
      </TemplateCard>
    </>
  )
}

const leaderboard = [
  { name: "Nova Kairo", genre: "Synthwave", score: "9.8K reacts" },
  { name: "Cielo Drift", genre: "Alt Pop", score: "8.9K reacts" },
  { name: "Bassline Ritual", genre: "Afro House", score: "8.2K reacts" },
]

const cadence = [
  {
    title: "Monday drop window",
    description: "Launch early in the competition cycle to maximize total reaction time.",
    meta: "Best",
  },
  {
    title: "Midweek audience check",
    description: "Use the feed and friends activity to spot tracks with breakout momentum.",
    meta: "Insight",
  },
  {
    title: "Weekend playlist push",
    description: "Convert strong songs into saves and repeat listening with playlist placements.",
    meta: "Growth",
  },
]

