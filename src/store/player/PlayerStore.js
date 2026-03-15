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

const usePlayerStore = create(
  devtools(
    (set, get) => ({
      playlist: DEFAULT_PLAYLIST,
      currentTrackIndex: 0,
      isVisible: false,
      isModalOpen: false,

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
