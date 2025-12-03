'use client'

import Link from "next/link"
import { Button } from "../ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { UserMenu } from "../auth/user-menu"
import ThemeToggle from "../theme/theme-toggle"

const navItems = [
    {
        title: "Home",
        href: '/'
    },
    {
        title: "Create",
        href: 'post/create'
    },
]

export default function Header() {
    const router = useRouter()
    const pathname = usePathname()

    const { data: session, isPending, error } = useSession()

    return <header className="px-4 py-2 z-10 border-b sticky">
        <nav className="container flex items-center justify-between gap-4">
            <div className="text-2xl cursor-pointer">
                <Link href='/'>NextJs blog App</Link>
            </div>

            <div className="flex items-center gap-4">
                {navItems.map((nav, idx) => (
                    <Link key={idx} href={nav.href} className={`${pathname !== nav.href && "text-muted-foreground"}`}>{nav.title}</Link>
                ))}
            </div>
            <div className="space-x-2">
                <ThemeToggle />
                
                {isPending ? null : session?.user ? (
                    <UserMenu user={session?.user} />
                ) :
                    <Button onClick={() => router.push('/auth')}>Login</Button>
                }

            </div>
        </nav>
    </header>
}