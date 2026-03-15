import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import {
  ChevronDown,
  Download,
  Maximize2,
  Minimize2,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import usePlayerStore from "@store/player/PlayerStore"
import ProfileVisualizer from "@components/music/visualizers/ProfileVisualizer"
import { useMobile } from "@hooks/use-mobile"

const RING_PROFILE_OPTIONS = [
  { key: "aggressive", label: "Aggressive" },
  { key: "soft", label: "Soft" },
  { key: "edm", label: "EDM" },
  { key: "relax", label: "Relax" },
]

export default function FloatingMusicPlayer() {
  const playlist = usePlayerStore((state) => state.playlist)
  const currentTrackIndex = usePlayerStore((state) => state.currentTrackIndex)
  const isVisible = usePlayerStore((state) => state.isVisible)
  const isModalOpen = usePlayerStore((state) => state.isModalOpen)
  const setTrackIndex = usePlayerStore((state) => state.setTrackIndex)
  const nextTrack = usePlayerStore((state) => state.nextTrack)
  const previousTrack = usePlayerStore((state) => state.previousTrack)
  const closePlayer = usePlayerStore((state) => state.closePlayer)
  const openModal = usePlayerStore((state) => state.openModal)
  const minimizeToMini = usePlayerStore((state) => state.minimizeToMini)
  const isMobile = useMobile()

  const track = playlist[currentTrackIndex]

  const audioRef = useRef(null)
  const audioContextRef = useRef(null)
  const sourceNodeRef = useRef(null)
  const analyserRef = useRef(null)
  const analyserDataRef = useRef(null)
  const analyserRafRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState("")
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.72)
  const [isMuted, setIsMuted] = useState(false)
  const [ringProfile, setRingProfile] = useState("edm")
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false)

  const trackUrl = track?.url || ""

  const activeRingProfile = useMemo(
    () => RING_PROFILE_OPTIONS.find((profileOption) => profileOption.key === ringProfile) ?? RING_PROFILE_OPTIONS[0],
    [ringProfile],
  )

  const formatTime = (seconds) => {
    const safeValue = Number.isFinite(seconds) ? seconds : 0
    const mins = Math.floor(safeValue / 60)
    const secs = Math.floor(safeValue % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const stopAnalyserLoop = useCallback(() => {
    if (analyserRafRef.current) {
      cancelAnimationFrame(analyserRafRef.current)
      analyserRafRef.current = null
    }
  }, [])

  const runAnalyserLoop = useCallback(() => {
    if (!analyserRef.current || !analyserDataRef.current) return

    const update = () => {
      if (analyserRef.current && analyserDataRef.current) {
        analyserRef.current.getByteFrequencyData(analyserDataRef.current)
        analyserRafRef.current = requestAnimationFrame(update)
      }
    }

    update()
  }, [])

  const ensureAudioReady = useCallback(async () => {
    if (!trackUrl) {
      setError("No track source available for this song.")
      return false
    }

    if (!audioRef.current) {
      const element = new Audio()
      element.crossOrigin = "anonymous"
      element.preload = "auto"
      element.volume = volume

      element.addEventListener("loadedmetadata", () => {
        setDuration(element.duration || 0)
      })

      element.addEventListener("timeupdate", () => {
        setCurrentTime(element.currentTime || 0)
      })

      element.addEventListener("ended", () => {
        nextTrack()
      })

      element.addEventListener("error", () => {
        setError("Audio source failed to load for this track.")
        setIsPlaying(false)
      })

      audioRef.current = element
    }

    if (!audioContextRef.current && audioRef.current) {
      const context = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = context.createAnalyser()

      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.82

      const source = context.createMediaElementSource(audioRef.current)
      source.connect(analyser)
      analyser.connect(context.destination)

      audioContextRef.current = context
      sourceNodeRef.current = source
      analyserRef.current = analyser
      analyserDataRef.current = new Uint8Array(analyser.frequencyBinCount)
      runAnalyserLoop()
    }

    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume()
    }

    return true
  }, [nextTrack, runAnalyserLoop, trackUrl, volume])

  useEffect(() => {
    if (!audioRef.current || !trackUrl) return

    const shouldResume = !audioRef.current.paused
    audioRef.current.src = trackUrl
    audioRef.current.load()
    setCurrentTime(0)
    setDuration(0)
    setError("")

    if (shouldResume) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(() => {
          setIsPlaying(false)
          setError("Track changed. Press play to continue.")
        })
    }
  }, [trackUrl])

  useEffect(() => {
    return () => {
      stopAnalyserLoop()

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      sourceNodeRef.current = null
      analyserRef.current = null
      analyserDataRef.current = null
      audioRef.current = null
      audioContextRef.current = null
    }
  }, [stopAnalyserLoop])

  useEffect(() => {
    if (!isVisible && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      setIsBusy(false)
      setCurrentTime(0)
    }
  }, [isVisible])

  useEffect(() => {
    if (!isModalOpen) return

    setIsProfileSelectorOpen(!isMobile)
  }, [isModalOpen, isMobile])

  const handleClosePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    setIsPlaying(false)
    setIsBusy(false)
    setCurrentTime(0)
    setDuration(0)
    setError("")
    closePlayer()
  }, [closePlayer])

  const togglePlayback = async () => {
    setIsBusy(true)
    setError("")

    try {
      const ready = await ensureAudioReady()
      if (!ready || !audioRef.current) {
        setIsBusy(false)
        return
      }

      if (!audioRef.current.src) {
        audioRef.current.src = trackUrl
      }

      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (playbackError) {
      console.log(playbackError)
      setError("Playback failed. Try pressing play again.")
      setIsPlaying(false)
    } finally {
      setIsBusy(false)
    }
  }

  const handleSeek = (event) => {
    if (!audioRef.current) return
    const nextTime = Number(event.target.value)
    audioRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value)
    setVolume(nextVolume)

    if (audioRef.current) {
      audioRef.current.volume = nextVolume
    }

    if (nextVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const handleRingProfileSelect = useCallback(
    (profileKey) => {
      setRingProfile(profileKey)

      if (isMobile) {
        setIsProfileSelectorOpen(false)
      }
    },
    [isMobile],
  )

  const toggleMute = () => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = volume
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const downloadTrack = async () => {
    if (!trackUrl) return

    try {
      const response = await fetch(trackUrl)
      const blob = await response.blob()
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${track?.title || "track"}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (downloadError) {
      console.log(downloadError)
      setError("Download blocked by network or CORS restrictions.")
    }
  }

  const volumeIcon = useMemo(() => {
    if (isMuted || volume === 0) return <VolumeX size={16} />
    if (volume < 0.5) return <Volume1 size={16} />
    return <Volume2 size={16} />
  }, [isMuted, volume])

  if (!isVisible || !track) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 w-[min(95vw,28rem)] rounded-2xl border border-(--prof-border) bg-(--prof-bg-elevated-strong)/95 p-3 shadow-[0_20px_60px_var(--prof-shadow-strong)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
            <Music size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{track.title}</p>
            <p className="truncate text-xs text-slate-400">{track.artist}</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => previousTrack()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition hover:bg-cyan-950/40 hover:text-cyan-200"
              aria-label="Previous track"
            >
              <SkipBack size={18} />
            </button>
            <button
              type="button"
              onClick={togglePlayback}
              disabled={isBusy}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
            </button>
            <button
              type="button"
              onClick={() => nextTrack()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition hover:bg-cyan-950/40 hover:text-cyan-200"
              aria-label="Next track"
            >
              <SkipForward size={18} />
            </button>
            <button
              type="button"
              onClick={openModal}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition hover:bg-cyan-950/40 hover:text-cyan-200"
              aria-label="Open player modal"
            >
              <Maximize2 size={16} />
            </button>
            <button
              type="button"
              onClick={handleClosePlayer}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition hover:bg-red-950/40 hover:text-red-200"
              aria-label="Close player"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="mt-3">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700"
          />
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end bg-black/70 p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true">
          <div className="mx-auto flex h-[min(92vh,48rem)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-(--prof-border) bg-(--prof-bg-base) shadow-[0_30px_120px_rgba(2,12,27,0.8)] lg:flex-row">
            <div className="relative h-72 w-full border-b border-(--prof-border) lg:h-auto lg:flex-1 lg:border-b-0 lg:border-r">
              <Canvas camera={{ position: [0, 4, 10], fov: 45 }}>
                <color attach="background" args={["#000000"]} />
                <fog attach="fog" args={["#000000", 8, 22]} />
                <ambientLight intensity={0.52} />
                <pointLight position={[0, 5, 6]} color="#22d3ee" intensity={1.25} />
                <pointLight position={[0, -3, -4]} color="#0e7490" intensity={0.35} />
                <ProfileVisualizer analyserDataRef={analyserDataRef} isPlaying={isPlaying} profile={ringProfile} />
              </Canvas>

              <div className="pointer-events-none absolute inset-x-0 top-0 bg-linear-to-b from-black/85 via-black/30 to-transparent p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Now playing</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">{track.title}</h2>
                <p className="text-sm text-slate-300">{track.artist}</p>
              </div>
            </div>

            <div className="flex w-full flex-col lg:w-[25rem]">
              <div className="flex items-center justify-between border-b border-(--prof-border) px-4 py-3">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Queue</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={minimizeToMini}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition hover:bg-cyan-950/40 hover:text-cyan-200"
                    aria-label="Minimize player"
                  >
                    <Minimize2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleClosePlayer}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition hover:bg-red-950/40 hover:text-red-200"
                    aria-label="Close player"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto border-b border-(--prof-border) p-3 lg:max-h-none lg:flex-1">
                <div className="space-y-2">
                  {playlist.map((item, index) => {
                    const isActive = index === currentTrackIndex
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTrackIndex(index)}
                        className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition ${
                          isActive
                            ? "border-cyan-400/40 bg-cyan-500/10"
                            : "border-(--prof-border) bg-(--prof-bg-panel) hover:border-(--prof-border-strong)"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">{item.title}</p>
                          <p className="truncate text-xs text-slate-400">{item.artist}</p>
                        </div>
                        {isActive ? <ChevronDown size={16} className="text-cyan-300" /> : null}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div className="space-y-2 rounded-2xl border border-(--prof-border) bg-(--prof-bg-panel) p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Shape profile</p>
                      <p className="mt-1 truncate text-xs text-slate-400 sm:hidden">{activeRingProfile.label} selected</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsProfileSelectorOpen((currentValue) => !currentValue)}
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-(--prof-border) bg-(--prof-bg-elevated) px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-100 sm:hidden"
                      aria-expanded={isProfileSelectorOpen}
                      aria-controls="profile-visualizer-options"
                      aria-label={isProfileSelectorOpen ? "Hide shape profile options" : "Show shape profile options"}
                    >
                      {activeRingProfile.label}
                      <ChevronDown
                        size={14}
                        className={["transition-transform duration-200", isProfileSelectorOpen ? "rotate-180" : "rotate-0"].join(" ")}
                      />
                    </button>
                  </div>

                  <div id="profile-visualizer-options" className={isProfileSelectorOpen || !isMobile ? "block" : "hidden"}>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {RING_PROFILE_OPTIONS.map((profileOption) => {
                        const profileKey = profileOption.key
                        const isActive = ringProfile === profileKey

                        return (
                          <button
                            key={profileKey}
                            type="button"
                            onClick={() => handleRingProfileSelect(profileKey)}
                            className={[
                              "rounded-xl border px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] transition",
                              isActive
                                ? "border-cyan-300/60 bg-cyan-400/20 text-cyan-100"
                                : "border-(--prof-border) bg-(--prof-bg-elevated) text-slate-300 hover:border-(--prof-border-strong) hover:text-cyan-100",
                            ].join(" ")}
                          >
                            {profileOption.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {error ? (
                  <p className="rounded-xl border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-200">{error}</p>
                ) : null}

                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700"
                />

                <div className="flex justify-between text-xs text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--prof-border) bg-(--prof-bg-panel) text-white transition hover:border-cyan-400/50 hover:text-cyan-300"
                    >
                      {volumeIcon}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="h-2 w-24 cursor-pointer appearance-none rounded-full bg-slate-700"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={previousTrack}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-cyan-950/40 hover:text-cyan-200"
                    >
                      <SkipBack size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={togglePlayback}
                      disabled={isBusy}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                    </button>
                    <button
                      type="button"
                      onClick={nextTrack}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-cyan-950/40 hover:text-cyan-200"
                    >
                      <SkipForward size={18} />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={downloadTrack}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-(--prof-border) bg-(--prof-bg-panel) px-4 py-2.5 text-sm text-white transition hover:border-cyan-400/50 hover:bg-cyan-950/30 hover:text-cyan-200"
                >
                  <Download size={16} />
                  Download current track
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
