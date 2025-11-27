import { ThemeProvider as NextThemeProvider, ThemeProviderProps } from "next-themes"

import { cn } from "@/lib/utils"
import Header from "../layout/header"

interface ExtendedThemeProviderProps extends ThemeProviderProps {
    containerClassName?: string
}

export default function ThemeProvider({
    children,
    containerClassName,
    ...props
}: ExtendedThemeProviderProps) {
    return <NextThemeProvider {...props}>
        <Header />
        <main className={cn("container mx-auto p-4", containerClassName)}>
            {children}
        </main>
    </NextThemeProvider>
}