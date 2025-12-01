'use client'

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeState {
    isDarkMode: boolean
    toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
    // "persist" middleware stores state in local storage, under the given name: theme-storage
    // so the preference survives page reloads
    persist(
        // "set" is the setter used to update local state
        set => ({
            isDarkMode: false,
            toggleTheme: () => set(state => ({ isDarkMode: !state.isDarkMode }))
        }),
        {
            name: "theme-storage"
        }
    )
)