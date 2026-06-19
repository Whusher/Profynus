import { useCallback, useEffect, useMemo, useState } from "react"
import Layout from "@components/layout/Layout"
import AppPageTemplate, {
  TemplateCard,
  TemplateList,
} from "@components/layout/AppPageTemplate"
import MusicPlayerSample from "@components/music/MusicPlayerSample"
import SEO from "@/services/SEO"
import { usePlayerStore } from "@store/index"
import musicService from "@/api/services/musicService"
import { ArrowRight, Copy, ExternalLink, Play, RefreshCcw, LoaderCircle } from "lucide-react"

export default function MusicPlayerPage() {
  return <Layout><MusicPlayerContent /></Layout>
}

function MusicPlayerContent() {
  const openPlayer = usePlayerStore((state) => state.openPlayer)
  const openModal = usePlayerStore((state) => state.openModal)
  const setPlaylist = usePlayerStore((state) => state.setPlaylist)
  const appendToPlaylist = usePlayerStore((state) => state.appendToPlaylist)

  const [songs, setSongs] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState("")

  const hasMoreSongs = pageNumber < totalPages

  const fetchSongs = useCallback(async (nextPage, { replace = false } = {}) => {
    setError("")
    if (replace) {
      setIsInitialLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const response = await musicService.getPublicPlaylist({ pageNumber: nextPage, pageSize })
      const nextItems = response?.items || []

      setSongs((currentSongs) => (replace ? nextItems : [...currentSongs, ...nextItems]))
      setPageNumber(response?.pageNumber || nextPage)
      setTotalPages(response?.totalPages || 1)
      setTotalItems(response?.totalItems || nextItems.length)

      if (replace) {
        setPlaylist(nextItems)
      } else {
        appendToPlaylist(nextItems)
      }
    } catch (fetchError) {
      setError(fetchError?.userMessage || fetchError?.message || "Unable to load public songs.")
    } finally {
      setIsInitialLoading(false)
      setIsLoadingMore(false)
    }
  }, [appendToPlaylist, pageSize, setPlaylist])

  useEffect(() => {
    fetchSongs(1, { replace: true })
  }, [fetchSongs])

  const handleLoadMore = () => {
    if (!hasMoreSongs || isLoadingMore) return
    fetchSongs(pageNumber + 1)
  }

  const handlePlayTrack = (track, index) => {
    const playlistIndex = songs.findIndex((song) => song.id === track.id)
    const nextIndex = playlistIndex >= 0 ? playlistIndex : index
    openPlayer(nextIndex)
    openModal()
  }

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
    } catch (copyError) {
      console.log(copyError)
    }
  }

  const librarySummary = useMemo(() => ({
    loaded: songs.length,
    totalItems,
    pageNumber,
    totalPages,
  }), [pageNumber, songs.length, totalItems, totalPages])

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
        title="Public song library"
        description="A horizontally scrollable catalog powered by the public playlist endpoint. Tap a card to open the floating player or copy the audio URL for later use."
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-(--prof-text-muted)">
          <p>
            Loaded {librarySummary.loaded} of {librarySummary.totalItems} songs · Page {librarySummary.pageNumber} of {librarySummary.totalPages}
          </p>
          <button
            type="button"
            onClick={() => fetchSongs(1, { replace: true })}
            className="inline-flex items-center gap-2 rounded-full border border-(--prof-border) bg-(--prof-bg-panel) px-3 py-2 text-xs font-medium text-white transition hover:border-(--prof-border-strong)"
          >
            <RefreshCcw size={14} />
            Refresh library
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-900/70 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {/* <div className="grid gap-4 sm:flex sm:overflow-x-auto sm:pb-3 sm:pr-1 sm:snap-x sm:snap-mandatory"> */}
        <div className="scrollbar-prof grid gap-4 sm:flex sm:overflow-x-auto sm:pb-3 sm:pr-1 sm:snap-x sm:snap-mandatory">
          {isInitialLoading ? (
            <LibrarySkeleton />
          ) : songs.length ? (
            songs.map((song, index) => (
              <article
                key={song.id}
                className="group relative w-full overflow-hidden rounded-[26px] border border-(--prof-border) bg-(--prof-bg-panel) shadow-[0_18px_50px_var(--prof-shadow-soft)] transition hover:border-(--prof-border-strong) sm:min-w-[18rem] sm:max-w-[18rem] sm:snap-start"
              >
                <div className="relative aspect-4/3 overflow-hidden border-b border-(--prof-border)">
                  <img
                    src={song.thumbnailUrl || "https://placehold.co/640x480/020617/22d3ee?text=Profynus"}
                    alt={`${song.songName || song.title} cover`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute left-3 top-3 rounded-full border border-cyan-300/30 bg-black/50 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-200 backdrop-blur">
                    {song.genre || "Unknown"}
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlayTrack(song, index)}
                    className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-(--prof-accent) px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-(--prof-accent-strong)"
                  >
                    <Play size={14} />
                    Play
                  </button>
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <p className="truncate text-base font-semibold text-white">{song.songName || song.title}</p>
                    <p className="truncate text-sm text-(--prof-text-muted)">{song.artistName || song.artist}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-(--prof-text-muted)">
                    <p className="rounded-xl border border-(--prof-border) bg-(--prof-bg-base) px-3 py-2">{song.albumName || song.album || "Single"}</p>
                    <p className="rounded-xl border border-(--prof-border) bg-(--prof-bg-base) px-3 py-2">{song.releaseYear || "—"}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs text-(--prof-text-muted)">
                    <span>{song.durationSeconds ? `${Math.floor(song.durationSeconds / 60)}:${String(song.durationSeconds % 60).padStart(2, "0")}` : "Live URL"}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(song.audioUrl)}
                      className="inline-flex items-center gap-2 rounded-full border border-(--prof-border) px-3 py-1.5 text-white transition hover:border-(--prof-border-strong)"
                    >
                      <Copy size={14} />
                      Copy URL
                    </button>
                  </div>

                  <a
                    href={song.audioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-(--prof-border) bg-(--prof-bg-base) px-3 py-2 text-sm text-white transition hover:border-(--prof-border-strong) hover:bg-(--prof-bg-chip)"
                  >
                    <ExternalLink size={14} />
                    Open audio URL
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-(--prof-border) bg-(--prof-bg-base) px-4 py-6 text-sm text-(--prof-text-muted)">
              No songs available yet.
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={!hasMoreSongs || isLoadingMore}
            className="inline-flex items-center gap-2 rounded-full border border-(--prof-border-strong) bg-(--prof-accent) px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-(--prof-accent-strong) disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            {hasMoreSongs ? "Load more songs" : "All songs loaded"}
          </button>

          <p className="text-sm text-(--prof-text-muted)">
            The playlist is mirrored into the floating player, so opening a song here also updates the persistent mini player.
          </p>
        </div>
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

function LibrarySkeleton() {
  return Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className="w-full animate-pulse overflow-hidden rounded-[26px] border border-(--prof-border) bg-(--prof-bg-panel) sm:min-w-[18rem] sm:max-w-[18rem]"
    >
      <div className="aspect-4/3 bg-(--prof-bg-chip)" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded-full bg-(--prof-bg-chip)" />
        <div className="h-3 w-1/2 rounded-full bg-(--prof-bg-chip)" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 rounded-xl bg-(--prof-bg-chip)" />
          <div className="h-10 rounded-xl bg-(--prof-bg-chip)" />
        </div>
      </div>
    </div>
  ))
}