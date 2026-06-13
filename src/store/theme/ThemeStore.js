/**
 * @file ThemeStore.js
 * @description Persistent theme selection for the Profynus app shell.
 */

import { create } from "zustand"
import { devtools, persist, createJSONStorage } from "zustand/middleware"
import { DEFAULT_THEME, isThemeValue } from "@features/theme/themes"

const useThemeStore = create(
  devtools(
    persist(
      (set) => ({
        theme: DEFAULT_THEME,
        setTheme: (theme) =>
          set({ theme: isThemeValue(theme) ? theme : DEFAULT_THEME }),
      }),
      {
        name: "profynus-theme",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ theme: state.theme }),
      }
    ),
    { name: "ThemeStore" }
  )
)

export default useThemeStore