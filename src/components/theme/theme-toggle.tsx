"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "../ui/button"
import { useTheme } from "next-themes"
import { useThemeStore } from "@/store/theme-store"
import { useEffect } from "react"

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const { isDarkMode, toggleTheme } = useThemeStore()

    useEffect(() => {
        if (theme === "dark" && !isDarkMode) {
            useThemeStore.setState({ isDarkMode: true })
        } else if (theme === "light" && isDarkMode) {
            useThemeStore.setState({ isDarkMode: false })
        }
    }, [theme, isDarkMode])

    const handleToggleTheme = () => {
        toggleTheme()
        setTheme(isDarkMode ? "light" : "dark")
    }

    return (
        <Button variant={"ghost"} onClick={handleToggleTheme}>
            {!isDarkMode ? <Sun className="h-5 w-5" /> :
                <Moon className="h-5 w-5" />
            }
        </Button>
    )
}