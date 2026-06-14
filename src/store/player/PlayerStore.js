import { create } from "zustand"
import { devtools } from "zustand/middleware"

export const DEFAULT_PLAYLIST = [
  {
    id: "gomd",
    title: "GOMD",
    artist: "Profynus Sample",
    url: "https://vps-master.duckdns.org/media/list/GOMD.mp3",
  },
  {
    id: "shala-1",
    title: "De Cara A La Pared",
    artist: "Shala Zua",
    url: "https://vps-master.duckdns.org/media/list/DeCaraAlaPared.mp3",
  },
  {
    id: "helix-2",
    title: "Skyline Pulse",
    artist: "SoundHelix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
]

const normalizeTrack = (track, index = 0) => ({
  id: track?.id || `${track?.title || track?.songName || 'track'}-${index}`,
  title: track?.title || track?.songName || 'Untitled track',
  artist: track?.artist || track?.artistName || 'Profynus',
  url: track?.url || track?.audioUrl || track?.downloadURL || track?.src || '',
  thumbnailUrl: track?.thumbnailUrl || track?.thumbnail || '',
  album: track?.album || track?.albumName || '',
  genre: track?.genre || '',
  releaseYear: track?.releaseYear || '',
  durationSeconds: track?.durationSeconds || 0,
  source: track,
})

const mapPlaylist = (tracks = []) => tracks.map((track, index) => normalizeTrack(track, index))

const usePlayerStore = create(
  devtools(
    (set, get) => ({
      playlist: DEFAULT_PLAYLIST,
      currentTrackIndex: 0,
      isVisible: false,
      isModalOpen: false,

      setPlaylist: (tracks, { keepCurrentTrack = false } = {}) => {
        const nextPlaylist = mapPlaylist(tracks)

        set((state) => ({
          playlist: nextPlaylist,
          currentTrackIndex:
            keepCurrentTrack && state.currentTrackIndex < nextPlaylist.length
              ? state.currentTrackIndex
              : 0,
        }))
      },

      appendToPlaylist: (tracks) => {
        const existingPlaylist = get().playlist
        const nextTracks = mapPlaylist(tracks)
        const nextPlaylist = [...existingPlaylist]

        nextTracks.forEach((track) => {
          const exists = nextPlaylist.some((playlistTrack) => playlistTrack.id === track.id)

          if (!exists) {
            nextPlaylist.push(track)
          }
        })

        set({ playlist: nextPlaylist })
      },

      setTrackIndex: (index) => {
        const maxIndex = get().playlist.length - 1
        const safeIndex = Math.min(Math.max(index, 0), Math.max(maxIndex, 0))
        set({ currentTrackIndex: safeIndex })
      },

      nextTrack: () => {
        const { currentTrackIndex, playlist } = get()
        if (!playlist.length) return
        set({ currentTrackIndex: (currentTrackIndex + 1) % playlist.length })
      },

      previousTrack: () => {
        const { currentTrackIndex, playlist } = get()
        if (!playlist.length) return
        const nextIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length
        set({ currentTrackIndex: nextIndex })
      },

      openPlayer: (index = 0) => {
        const maxIndex = get().playlist.length - 1
        const safeIndex = Math.min(Math.max(index, 0), Math.max(maxIndex, 0))
        set({ isVisible: true, currentTrackIndex: safeIndex })
      },

      closePlayer: () => {
        set({ isVisible: false, isModalOpen: false })
      },

      openModal: () => {
        set({ isVisible: true, isModalOpen: true })
      },

      minimizeToMini: () => {
        set({ isModalOpen: false, isVisible: true })
      },
    }),
    { name: "ProfynusPlayerStore" },
  ),
)

export default usePlayerStore
