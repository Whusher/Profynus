import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { motion } from "framer-motion"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Download,
  Repeat,
  Music,
} from "lucide-react"
import * as THREE from "three"

const DEFAULT_TRACK = {
  title: "GOMD",
  artist: "Profynus Sample",
  url: "https://vps-master.duckdns.org/media/list/GOMD.mp3",
}

const pseudoRandom = (seed) => {
  const raw = Math.sin(seed * 12.9898) * 43758.5453
  return raw - Math.floor(raw)
}

export default function MusicPlayerSample({ track = DEFAULT_TRACK }) {
  const audioRef = useRef(null)
  const audioContextRef = useRef(null)
  const sourceNodeRef = useRef(null)
  const analyserRef = useRef(null)
  const analyserDataRef = useRef(null)
  const analyserRafRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.75)
  const [isMuted, setIsMuted] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState("")

  const trackUrl =
    track?.url ||
    track?.downloadURL ||
    track?.src ||
    DEFAULT_TRACK.url

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

  const setupAudio = useCallback(async () => {
    if (!trackUrl) {
      setError("No audio source found. Provide url or downloadURL for the current track.")
      return
    }

    if (!audioRef.current) {
      const element = new Audio()
      element.crossOrigin = "anonymous"
      element.src = trackUrl
      element.preload = "auto"
      element.volume = volume
      element.loop = isLooping

      element.addEventListener("loadedmetadata", () => {
        setDuration(element.duration || 0)
      })

      element.addEventListener("timeupdate", () => {
        setCurrentTime(element.currentTime || 0)
      })

      element.addEventListener("ended", () => {
        setIsPlaying(false)
      })

      element.addEventListener("error", () => {
        const mediaError = element.error
        const mediaErrorMap = {
          1: "Loading aborted by the browser.",
          2: "Network error while fetching audio source.",
          3: "Audio was loaded but could not be decoded.",
          4: "The source is not supported by this player/browser.",
        }

        const details = mediaError ? mediaErrorMap[mediaError.code] || "Unknown media error." : "Unknown media error."
        setError(`Unable to load audio source. ${details} URL: ${trackUrl}`)
        setIsPlaying(false)
        setIsBusy(false)
      })

      audioRef.current = element
    }

    if (!audioContextRef.current) {
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

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume()
    }
  }, [isLooping, runAnalyserLoop, trackUrl, volume])

  const togglePlayback = async () => {
    setError("")
    setIsBusy(true)

    try {
      await setupAudio()

      if (!audioRef.current) {
        setIsBusy(false)
        return
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
      setError("Playback failed. Try interacting with the page and play again.")
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

  const handleSkip = (seconds) => {
    if (!audioRef.current) return

    const nextTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration || 0)
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

  const toggleLoop = () => {
    setIsLooping((prev) => {
      const nextValue = !prev
      if (audioRef.current) {
        audioRef.current.loop = nextValue
      }
      return nextValue
    })
  }

  const downloadTrack = async () => {
    try {
      const response = await fetch(trackUrl)
      const blob = await response.blob()
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${track.title || "track"}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (downloadError) {
      console.log(downloadError)
      setError("Download failed due to network or CORS restrictions.")
    }
  }

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

  const volumeIcon = useMemo(() => {
    if (isMuted || volume === 0) return <VolumeX size={18} />
    if (volume < 0.5) return <Volume1 size={18} />
    return <Volume2 size={18} />
  }, [isMuted, volume])

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[28px] border border-(--prof-border) bg-(--prof-bg-elevated-strong) shadow-[0_24px_60px_var(--prof-shadow-strong)]">
        <div className="relative h-95 w-full">
          <Canvas camera={{ position: [0, 4, 10], fov: 45 }}>
            <color attach="background" args={["#000000"]} />
            <fog attach="fog" args={["#000000", 8, 22]} />
            <ambientLight intensity={0.45} />
            <pointLight position={[0, 6, 4]} color="#22d3ee" intensity={1.6} />
            <pointLight position={[0, -5, -4]} color="#0891b2" intensity={0.4} />
            <ReactiveWave analyserDataRef={analyserDataRef} isPlaying={isPlaying} />
            <FrequencyRing analyserDataRef={analyserDataRef} isPlaying={isPlaying} />
            <FloatingParticles isPlaying={isPlaying} />
            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.45} />
          </Canvas>

          <div className="pointer-events-none absolute inset-x-0 top-0 bg-linear-to-b from-black/85 via-black/30 to-transparent p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-cyan-900/70 bg-cyan-950/35">
                <Music className="text-cyan-300" size={32} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Now playing</p>
                <h2 className="text-2xl font-semibold text-white">{track.title}</h2>
                <p className="text-sm text-slate-300">{track.artist}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-(--prof-border) bg-(--prof-bg-elevated) p-5 shadow-[0_18px_50px_var(--prof-shadow-soft)]">
        {error ? (
          <p className="mb-4 rounded-2xl border border-red-900/70 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</p>
        ) : null}

        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700"
          />
          <div className="mt-2 flex justify-between text-xs text-(--prof-text-muted)">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
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
            <button
              type="button"
              onClick={toggleLoop}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-white transition ${
                isLooping
                  ? "border-cyan-300/50 bg-cyan-950/50 text-cyan-300"
                  : "border-(--prof-border) bg-(--prof-bg-panel) hover:border-cyan-400/50 hover:text-cyan-300"
              }`}
            >
              <Repeat size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={() => handleSkip(-10)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:text-cyan-300"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <SkipBack size={22} />
            </motion.button>

            <motion.button
              type="button"
              onClick={togglePlayback}
              disabled={isBusy}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              {isBusy ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              ) : isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} fill="currentColor" />
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => handleSkip(10)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:text-cyan-300"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <SkipForward size={22} />
            </motion.button>
          </div>

          <button
            type="button"
            onClick={downloadTrack}
            className="inline-flex items-center gap-2 rounded-full border border-(--prof-border) bg-(--prof-bg-panel) px-4 py-2 text-sm text-white transition hover:border-cyan-400/50 hover:bg-cyan-950/30 hover:text-cyan-200"
          >
            <Download size={17} />
            Download sample
          </button>
        </div>
      </div>
    </div>
  )
}

function ReactiveWave({ analyserDataRef, isPlaying }) {
  const meshRef = useRef(null)
  const geometry = useMemo(() => new THREE.PlaneGeometry(14, 14, 58, 58), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const positions = meshRef.current.geometry.attributes.position.array
    const data = analyserDataRef.current
    const elapsed = clock.getElapsedTime()

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      const sample = data ? data[(i / 3) % data.length] / 255 : 0
      const pulse = isPlaying ? sample * 1.35 : sample * 0.35
      positions[i + 2] = Math.sin(x * 0.75 + elapsed * 1.1) * 0.28 + Math.cos(y * 0.65 + elapsed * 0.8) * 0.18 + pulse
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.rotation.x = -1.12
    meshRef.current.rotation.z = Math.sin(elapsed * 0.2) * 0.04
  })

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, -2.4, 0]}>
      <meshStandardMaterial color="#22d3ee" wireframe transparent opacity={0.72} emissive="#0e7490" emissiveIntensity={0.5} />
    </mesh>
  )
}

function FrequencyRing({ analyserDataRef, isPlaying }) {
  const barsRef = useRef([])

  const bars = useMemo(() => {
    const count = 48
    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2
      const radius = 3.5
      return {
        position: [Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius],
        rotationY: -angle,
      }
    })
  }, [])

  useFrame(({ clock }) => {
    const data = analyserDataRef.current
    const drift = clock.getElapsedTime()

    barsRef.current.forEach((bar, index) => {
      if (!bar) return
      const sample = data ? data[index % data.length] / 255 : 0
      const energy = isPlaying ? sample : sample * 0.25
      const height = 0.3 + energy * 3.2

      bar.scale.y = height
      bar.position.y = -1.1 + height / 2
      bar.material.emissiveIntensity = 0.22 + energy * 0.9
      bar.rotation.z = Math.sin(drift * 0.35 + index * 0.2) * 0.1
    })
  })

  return (
    <group>
      {bars.map((bar, index) => (
        <mesh
          key={index}
          ref={(node) => {
            barsRef.current[index] = node
          }}
          position={bar.position}
          rotation={[0, bar.rotationY, 0]}
        >
          <boxGeometry args={[0.16, 1, 0.2]} />
          <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function FloatingParticles({ isPlaying }) {
  const pointsRef = useRef(null)

  const [positions, material] = useMemo(() => {
    const count = 260
    const positionsArray = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      positionsArray[i * 3] = (pseudoRandom(i * 3 + 1) - 0.5) * 22
      positionsArray[i * 3 + 1] = (pseudoRandom(i * 3 + 2) - 0.5) * 12
      positionsArray[i * 3 + 2] = (pseudoRandom(i * 3 + 3) - 0.5) * 18
    }

    const pointsMaterial = new THREE.PointsMaterial({
      color: "#22d3ee",
      size: 0.06,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    })

    return [positionsArray, pointsMaterial]
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return

    const speed = isPlaying ? 0.22 : 0.08
    pointsRef.current.rotation.y += speed * 0.01
    pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.18) * 0.2
  })

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  )
}
