import Container from "@/components/layout/container"
import PostForm from "@/components/post/post-form"
import { getPostBySlug } from "@/lib/db/queries"
import { notFound } from "next/navigation"

export default async function Edit({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if (!post) notFound()

    return (
        <Container className="max-w-3xl">
            <h1 className="text-4xl my-10 font-bold">Edit Post</h1>
            <PostForm
                isEditing={true}
                post={{
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    content: post.content,
                    slug: post.slug
                }}
            />
        </Container>
    )
}