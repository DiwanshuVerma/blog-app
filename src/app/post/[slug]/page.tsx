import { PostContent } from "@/components/post/post-content"
import { auth } from "@/lib/auth"
import { getPostBySlug } from "@/lib/db/queries"
import { headers } from "next/headers"
import { notFound } from "next/navigation"


export default async function Post({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if(!post){
        notFound()
    }
    const session = await auth.api.getSession({
        headers: await headers()
    })

    // get author info
    const isAuthor = session?.user?.id === post.authorId

    return (
        <main className="py-10 max-w-3xl m-auto">
            <PostContent post={post} isAuthor={isAuthor}/>
        </main>
    )
}