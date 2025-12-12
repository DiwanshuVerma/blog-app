import { UserInfo } from "@/components/profile/user-info"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Profile() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session || !session.user) {
        redirect("/")
    }

    return (
        <main className="my-8">
            <div className="max-w-3xl m-auto">
                <h2 className="mb-4 text-3xl font-bold">User Profile</h2>
                <UserInfo user={session.user}/>
            </div>
        </main>
    )
}