'use client'

import { User } from "better-auth"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import Link from "next/link"
import { LogOutIcon, PencilIcon, UserIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

interface UserMenuProps {
    user: User
}

export function UserMenu({ user }: UserMenuProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
    }

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged out successfully!")
                        router.refresh()
                    }
                }
            })
        } catch (error) {
            toast.error("Failed to log out. Try again later.")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 rounded-full">
                    <Avatar>
                        <AvatarFallback>{getInitials(user?.name || "User")}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <div className="space-y-1 p-2">
                    <p className="font-bold">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <UserIcon className="mr-2 h-2 w-2" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/post/create">
                        <PencilIcon className="mr-2 h-2 w-2" />
                        <span>Create</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={isLoading} onClick={handleLogout} >
                    <LogOutIcon className="mr-2 h-2 w-2" />
                    <span>{isLoading ? "Logging out..." : "Logout"}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}