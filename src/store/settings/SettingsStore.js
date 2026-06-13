import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

const useSettingsStore = create(
  devtools(
    persist(
      (set) => ({
        reducedMotion: false,
        compactLayout: false,
        playbackHints: true,
        queueAutofocus: true,
        setReducedMotion: (value) => set({ reducedMotion: Boolean(value) }),
        setCompactLayout: (value) => set({ compactLayout: Boolean(value) }),
        setPlaybackHints: (value) => set({ playbackHints: Boolean(value) }),
        setQueueAutofocus: (value) => set({ queueAutofocus: Boolean(value) }),
        resetSettings: () =>
          set({
            reducedMotion: false,
            compactLayout: false,
            playbackHints: true,
            queueAutofocus: true,
          }),
      }),
      {
        name: "profynus-settings",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          reducedMotion: state.reducedMotion,
          compactLayout: state.compactLayout,
          playbackHints: state.playbackHints,
          queueAutofocus: state.queueAutofocus,
        }),
      }
    ),
    { name: "SettingsStore" }
  )
)

export default useSettingsStore