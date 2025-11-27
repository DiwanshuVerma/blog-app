'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "@/components/theme/theme-provider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity
        }
    }
})

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryClientProvider client={queryClient} >
                {children}
            </QueryClientProvider>
        </ThemeProvider>

    )
}